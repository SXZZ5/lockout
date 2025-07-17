package org.lockout;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import org.w3c.dom.Attr;
import software.amazon.awssdk.core.internal.waiters.ResponseOrException;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.Page;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryEnhancedRequest;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.DescribeTableResponse;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;
import software.amazon.awssdk.services.dynamodb.waiters.DynamoDbWaiter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import software.amazon.awssdk.services.dynamodb.model.DescribeTableRequest;

/**
 * All database calls here.
 * Some static parts also for connecting to the database, initialised at Lambda startup.
 */
public class Dbops {
    /**
     * The old dyanamoDB client.
     * Still Required to create the enhanced client.
     * Actually used for some parts, not everything can be done with the enhanced client
     * (Or I did not manage to figure out how yet)
     */
    static DynamoDbClient ddbclient;
    /**
     * The enhanced dynamoDb client, makes some parts easier.
     */
    static DynamoDbEnhancedClient ddbeclient;
    /**
     * Reference to the actual DynamoDBTable for the application.
     */
    static DynamoDbTable<Data> ddbt;
    static LambdaLogger logger ;

    public static void InitDdbModel() {
        //just to assert that this function is not running on every API request or every database call.

        ddbclient = DynamoDbClient.builder().region(Region.AP_SOUTH_1).build();
        ddbeclient = DynamoDbEnhancedClient.builder().dynamoDbClient(ddbclient).build();
        ddbt = ddbeclient.table(
                "lockout", TableSchema.fromBean(Data.class)
        );

        //make ddbeclient separately because it is useful to pass to the DynamoDbWaiter thingy later on
        //as and when needed.

        //TableSchema.fromBean made a schema and then DdbEnhancedClient
        //made ddb table model from the schema with the name "lockout_table"
    }

    /**
     * Creates DynamoDb table if it does not already exist.
     * TODO: I should probably remove this function completely ? I suppose it is wasting time.
     */
    public static void CreateActualTableIfNeeded() {
        try {
            ddbclient.describeTable(DescribeTableRequest.builder().tableName("lockout").build());
            return;
        } catch (Exception e) {
            System.out.println("Table does not already exist probably. \n Going to make it.");
        }
        ddbt.createTable();
        try (DynamoDbWaiter waiter = DynamoDbWaiter.builder().client(ddbclient).build()) { // DynamoDbWaiter is Autocloseable
            ResponseOrException<DescribeTableResponse> response = waiter
                    .waitUntilTableExists(builder -> builder.tableName("Customer").build())
                    .matched();
            response.response().orElseThrow(
                    () -> new RuntimeException("Customer table was not created."));
            // The actual error can be inspected in response.exception()
        }
    }

    /**
     * Just take the whole user out of the database at return.
     * Authentication and stuff is not our responsibility here.
     * Assuming most users are going to be authenticated, not a bad idea to extract the whole row
     * at once, maybe I am mistaken.
     * @param user The user to get with whatever email he/she claims he/she is.
     * @return  The whole row of data corresponding to the user.
     * @throws Exception
     */
    public static Data getUser(User user) throws Exception {
        //get the user data and compare session ids here.
        var keyEqual = QueryConditional.keyEqualTo(
                builder -> builder.partitionValue(user.email)
        );

        var tableQuery = QueryEnhancedRequest.builder().queryConditional(keyEqual).build();
        PageIterable<Data> result = ddbt.query(tableQuery);
        var cnt = result.stream().count();
        logger.log("Count of matching table entries:" + cnt);
        if (cnt == 0) {
            return null;
        } else if (cnt > 1) {
            throw new Exception("multiple entries for one user email");
        } else {
            Page<Data> pg = result.stream().findFirst().orElseThrow(() -> new Exception("no user exists"));
            List<Data> list = pg.items();
            return list.get(0);
        }
    }

    /**
     * Modifies the user.
     * Any validations/safety are not the responsibility here.
     * Take the given {@link User}, and send the whole thing to DB. Full row replacement.
     * @param user the user object to. Note that this object contains the "Data" field for the user.
     *             (assuming they were correctly authenticated, otherwise it would be null but this call
     *             will never be made for an unauthenticated user)
     * @throws Exception if for some reason it turns out that the user we are trying to update does not
     * even exist.
     */
    public static void updateUserInfo(User user) throws Exception {
        logger.log("updateUserInfo user.dbuser: " + user.dbuser.toString());
        //prepare the list that will replace the old list.
        //yes, you have to map each attribute manually.
        List<AttributeValue> attrList = new ArrayList<>();
        for (Info item : user.dbuser.getUserdata()) {
            AttributeValue attr = AttributeValue.builder().
                    m(Map.of(
                            "description", AttributeValue.builder().s(item.getDescription()).build(),
                            "pwdhash", AttributeValue.builder().s(item.getPwdhash()).build(),
                            "epochTime", AttributeValue.builder().n(item.getEpochTime().toString()).build(),
                            "cooldownHours", AttributeValue.builder().n(item.getCooldownHours().toString()).build(),
                            "obfuscated", AttributeValue.builder().s(item.getObfuscated()).build()
                    )).build();
            attrList.add(attr);
        }


        UpdateItemRequest updateItemRequest = UpdateItemRequest.builder()
                .key(Map.of("email", AttributeValue.builder().s(user.email).build()))
                .tableName("lockout")
                .updateExpression("SET userdata = :u")
                .expressionAttributeValues(Map.of(":u", AttributeValue.builder().l(attrList).build()))
                .build();

        ddbclient.updateItem(updateItemRequest);
    }

    /**
     * Updates the session information (sessionToken and sessiontime)
     * Called on every login basically.
     * Independently takes the current time just at the time of making change in db while the session
     * token is provided by the caller.
     * @param user The user whose session has to be updated.
     * @param sessionToken The random id generated for the cookie token.
     * @throws Exception if the user somehow doesn't exist or something.
     */
    public static void updateUserSession(User user, String sessionToken) throws Exception {
        Long curtime = Instant.now().toEpochMilli();
        String sessiontime = curtime.toString();
        AttributeValue session_id = AttributeValue.builder().s(sessionToken).build();
        UpdateItemRequest updateItemRequest = UpdateItemRequest.builder()
                .key(Map.of("email", AttributeValue.builder().s(user.email).build()))
                .tableName("lockout")
                .updateExpression("SET sessiontoken = :s, sessiontime = :t")
                .expressionAttributeValues(Map.of(
                        ":s", session_id,
                        ":t", AttributeValue.builder().n(sessiontime).build()))
                .build();

        ddbclient.updateItem(updateItemRequest);
    }

    /**
     * Create a new user in database.
     * Be very careful, this function doesn't check if user already exists, the caller has to check
     * that with the {@link #getUser(User)} method.
     * In case of mishap, the entire user data will get emptied for this user.
     * @param user
     * @param sessiontoken
     * @throws Exception
     */
    public static void makeUser(User user, String sessiontoken) throws Exception {
        //set the user's session id here.
        List<Info> tmp_empty = new ArrayList<>();
        logger.log("received user by Dbops.makeUser is: " + user.toString());
        Data newUser = new Data(
                user.email,
                AppUtils.hashpassword(user.password),
                sessiontoken,
                Instant.now().toEpochMilli(),
                tmp_empty
        );


        logger.log(newUser.toString());
        ddbt.putItem(newUser);
        logger.log("created user" + user.email + "correctly");
    }
}
