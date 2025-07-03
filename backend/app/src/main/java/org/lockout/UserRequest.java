package org.lockout;

import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

/**
 * Defines the schema for {@link Action} field api post requests for storing, updating, revealing etc of secrets.
 * ACTION field is supposed to contain what the client wants to do.
 * Used mainly in the {@link Updates} child of {@link UserRequest} only, since {@link Login} or {@link Signup} obviously
 * don't need any {@link Action} as such.
 */
class Action {
    String clause;
    String description;
    String zkpwdhash;
    String obfuscated;

    public String getZkpwdhash() {
        return zkpwdhash;
    }

    public void setZkpwdhash(String zkpwdhash) {
        this.zkpwdhash = zkpwdhash;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getClause() {
        return clause;
    }

    public String getObfuscated() {
        return obfuscated;
    }

    public void setObfuscated(String obfuscated) {
        this.obfuscated = obfuscated;
    }

    public void setClause(String clause) {
        this.clause = clause;
    }
}

/**
 * Final form of the incoming user request. First we deserialise incoming HTTP request to {@link LambdaInput} and finally to
 * {@link UserRequest} to get all that ACTION ({@link Action} part and similar stuff properly deserialised from the {@link LambdaInput#getBody()}
 * More of a conceptual intermediary than anything else. {@link Login}, {@link Signup}, {@link Getinfo} etc inherit fields from this
 * class and implement their own methods or logic.
 */
abstract public class UserRequest {
    /**
     * The jackson object mapper that we will be using for deserialising the "body" of incoming request.
     */
    static ObjectMapper objectMapper = new ObjectMapper();
    String email;
    String password;
    String sessiontoken; //cookie se nikalke bharunga, client isn't sending session in body.
    /**
     * Notice this is a map since ofcourse there can be multiple cookies for each request.
     */
    Map<String, String> cookies;
    List<Info> info;
    Action action;

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public UserRequest() {}

    /**
     * Further Deserialises the body of {@link LambdaInput} and also extracts cookies from the headers of {@link LambdaInput}
     * @param input The first level of deserialisation from the incoming HTTP request.
     * @throws Exception
     */
    public UserRequest(LambdaInput input) throws Exception {
        setParsedBody(input); //cookies map automatically null reh jayega.
        setParsedCookies(input); //cookies map ke alawa kuch touch nhi karega.
    }

    /**
     * Parse the body of incoming request and deserialise into an object of type this = {@link UserRequest}
     * @param input
     * @throws Exception
     */
    public final void setParsedBody(LambdaInput input) throws Exception {
        if (input.getBody() == null) {
            return;
        }
        try {
            objectMapper.readerForUpdating(this).readValue(input.getBody(), this.getClass());
            Glogger.log("logging targetobj" + this.toString());
        } catch (Exception e) {
            Glogger.log("body_targetObj nahi ban paya: " + e.toString());
            throw e;
        }
    }

    /**
     * Read cookie header which is a string of cookies separated by ;
     * Does some parsing and splitting to separate into individual cookies.
     * @param input Again the first level of deserialisation coming from the HTTP request.
     * @throws Exception
     */
    public final void setParsedCookies(LambdaInput input) throws Exception {
        if (input.getHeaders() == null) {
            return;
        }
        if(input.getHeaders().get("cookie") == null) {
            return ;
        }

        try {
            String cookieHeader = input.getHeaders().get("cookie");
            String[] cookiesz = cookieHeader.split(";");
            Map<String, String> cookieMap = new HashMap<>();
            for (String oneCookie : cookiesz) {
                String[] keyVal = oneCookie.split("=");
                cookieMap.put(keyVal[0], keyVal[1]);
            }
            this.setCookies(cookieMap);
        } catch (Exception e) {
            Glogger.log("session_taretObj nahi ban paya: " + e.toString());
            throw e;
        }
    }

    public Map<String, String> getCookies() {
        return cookies;
    }

    public final void setCookies(Map<String, String> cookies) {
        this.cookies = cookies;
        this.sessiontoken = cookies.get("sessiontoken");
    }

    public final String getPassword() {
        return password;
    }

    public final void setPassword(String password) {
        this.password = password;
    }

    public final String getEmail() {
        return email;
    }

    public final void setEmail(String username) {
        this.email = username;
    }

    @JsonProperty("sessiontoken")
    public final String getSessiontoken() {
        return sessiontoken;
    }

    public final void setSessiontoken(String sessiontoken) {
        this.sessiontoken = sessiontoken;
    }

    public List<Info> getInfo() {
        return info;
    }

    public void setInfo(List<Info> info) {
        this.info = info;
    }

    @Override
    public String toString() {
        String result = "email: " + email + ",\n password: " + password;
        if (sessiontoken != null) {
            result += "session: " + sessiontoken;
        }
        return result;
    }
}

/**
 * Signup related methods here.
 * Not much really, creates an instance of {@link User} somewhere and uses it to make basic calls.
 * Prepares, response object that will be used for setting {@link Router#response} that is finally returned to {@link Handler#handleRequest}
 */
class Signup extends UserRequest {
    public Signup(LambdaInput input) throws Exception {
        super(input);
    }

    public Map<String, Object> createUser() throws Exception {
        User user = new User(email, password);
        if(user.userAlreadyExists()){
            return RespondBad();
        }
        String usersession = AppUtils.generateSession().toString();
        String sessionToken = AppUtils.hashpassword(usersession);
        Glogger.log("usersession: " + usersession);
        Glogger.log("sessionToken: " + sessionToken);
        Glogger.log("user create in signup createUser call" + user.toString());
        if (user.create(sessionToken)) {
            user.setSessiontoken(usersession);
            return RespondGood(user);
        } else {
            return RespondBad();
        }
    }

    public Map<String, Object> RespondGood(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 200);
        response.put("cookies", new String[]{
            "sessiontoken=" + user.getSessiontoken() + "; Path=/; HttpOnly; Secure",});
        response.put("body", "Signup successful.");
        return response;
    }

    public Map<String, Object> RespondBad() {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 400);
        response.put("body", "Couldn't signup user.");
        return response;
    }
}

/**
 * Login related methods here.
 * Not much really, creates an instance of {@link User} somewhere and uses it to make basic calls.
 * Prepares, response object that will be used for setting {@link Router#response} that is finally returned to {@link Handler#handleRequest}
 */
class Login extends UserRequest {
    public Login(LambdaInput input) throws Exception {
        super(input);
    }
    public Map<String, Object> verifyUserCredentials() {
        User user = new User(email, password);
        String usersession = AppUtils.generateSession().toString();
        String sessionToken = AppUtils.hashpassword(usersession);
        Glogger.log("usersession: " + usersession);
        Glogger.log("sessionToken: " + sessionToken);

        if(email == null || password == null) {
            return RespondBad();
        }
        Glogger.log(user.toString());
        if (user.verifyCredentials(sessionToken)) {
            user.setSessiontoken(usersession);
            return RespondGood(user);
        } else {
            return RespondBad();
        }
    }

    public Map<String, Object> RespondGood(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 200);
        response.put("cookies", new String[]{
                "sessiontoken=" + user.getSessiontoken() + "; Path=/; HttpOnly; Secure; SameSite=None",});
        response.put("body", "Login successful.");
        return response;
    }

    public Map<String, Object> RespondBad() {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 400);
        response.put("body", "User not found. Not authenticated.");
        return response;
    }
}


/**
 * Getting User Info related methods here.
 * Not much really, creates an instance of {@link User} somewhere and uses it to make basic calls.
 * Prepares, response object that will be used for setting {@link Router#response} that is finally returned to {@link Handler#handleRequest}
 */
class Getinfo extends UserRequest {
    public Getinfo(LambdaInput input) throws Exception {
        super(input);
    }

    public Map<String, Object> verifyUserSession() {
        User user = new User(email, password, sessiontoken);
        Glogger.log("User created in Getinfo" + user.toString());
        if (user.verifySession()) {
            try {
                user.concealDbuser();
                String jsonBody = UserRequest.objectMapper.writeValueAsString(user.dbuser);
                return RespondGood(jsonBody);
            } catch (Exception e) {
                Glogger.log("verifyUserSession: " + e.toString());
                return RespondBad();
            }
        } else {
            Glogger.log("user verification failed");
            return RespondBad();
        }
    }

    public Map<String, Object> RespondGood(String jsonBody) {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 200);
        response.put("contentType", "application/json");
        response.put("body", jsonBody);
        return response;
    }

    public Map<String, Object> RespondBad() {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 400);
        response.put("body", "Not authenticated. Session Not found");
        return response;
    }
}


/**
 * Updating User Info related methods here.
 * Not much really, creates an instance of {@link User} somewhere and uses it to make basic calls.
 * Prepares, response object that will be used for setting {@link Router#response} that is finally returned to {@link Handler#handleRequest}
 */
class Updates extends UserRequest {
    public Updates(LambdaInput input) throws Exception {
        super(input);
    }

    public Map<String, Object> updateUser(){
        if(action == null) {
            return RespondBad();
        }

        User user = new User(email, password, sessiontoken);
        Glogger.log("User created in updateUser" + user.toString());
        if(user.verifySession() == false) {
            return RespondBad();
        }

        if(action.description.length() <= 0) {
            return RespondBad();
        }

        try {
            switch (action.clause) {
                case "create":
                    user.createInfo(action.description, action.zkpwdhash, action.obfuscated);
                    return RespondGood();
                case "delete":
                    user.deleteInfo(action.description);
                    return RespondGood();
                case "reveal":
                    user.updateInfo(action.description);
                    return RespondGood();
                default :
                    return RespondBad();
            }
        } catch (Exception e) {
            Glogger.log("updateUser(): " + e.toString());
            return RespondBad();
        }
    }

    public Map<String, Object> RespondGood() {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 200);
        response.put("contentType", "application/json");
        response.put("body", "Information updated successfully.");
        return response;
    }

    public Map<String, Object> RespondBad() {
        Map<String, Object> response = new HashMap<>();
        response.put("statusCode", 400);
        response.put("body", "Not authenticated. Session Not found. Bad action clause");
        return response;
    }
}