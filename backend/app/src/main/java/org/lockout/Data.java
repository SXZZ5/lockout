package org.lockout;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

/**
 * Represents one "row" in the DynamoDB table.
 * Basically this blueprint IS the database schema.
 */
@DynamoDbBean
public class Data {
   /**
    * Partition key for the database.
    * MUST be unique. (maintain uniqueness by checking before inserting)
    */
   private String email;
   /**
    * Login password for the user.
    * Not one of the "secrets" the user stores.
    */
   private String password;
   /**
    * The actual userdata, there secrets that we want to store and manage.
    * Check out {@link Info} for the actual unit of user data.
    */
   private List<Info> userdata;
   /**
    * The token for latest session for the user.
    * Sent to the user in a cookie and expected from a user in the cookie.
    */
   private String sessiontoken;
   /**
    * The epoch time of when the latest session started.
    * Used to check if session should be invalidated now and require login again.
    */
   private Long sessiontime;

   @DynamoDbPartitionKey
   public String getEmail() {
      return email;
   }

   @Override
   public String toString() {
      return "email: " + email + "\n password: " + password + "\n sessiontoken: " + sessiontoken;
   }

   /*generated code starts*/
   public Data() {
   }

   public Data(String email, String password, String session, Long sessiontime, List<Info> userdata) {
      this.email = email;
      this.password = password;
      this.sessiontoken = session;
      this.userdata = userdata;
      this.sessiontime = sessiontime;
   }

   public Long getSessiontime() {
      return sessiontime;
   }

   public void setSessiontime(Long sessiontime) {
      this.sessiontime = sessiontime;
   }

   public String getSessiontoken() {
      return sessiontoken;
   }

   public void setSessiontoken(String sessiontoken) {
      this.sessiontoken = sessiontoken;
   }

   public List<Info> getUserdata() {
      return userdata;
   }

   public void setUserdata(List<Info> userdata) {
      this.userdata = userdata;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public void setPassword(String password) {
      this.password = password;
   }

   public String getPassword() {
      return this.password;
   }
   /*generated code ends*/
}

