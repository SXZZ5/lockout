package org.lockout;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

class Action {
    String clause;
    String description;
    String zkpwdhash;

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

    public void setClause(String clause) {
        this.clause = clause;
    }
}

abstract public class UserRequest {
    static ObjectMapper objectMapper = new ObjectMapper();
    String email;
    String password;
    String sessiontoken; //cookie se nikalke bharunga, client isn't sending session in body.
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
    public UserRequest(LambdaInput input) throws Exception {
        setParsedBody(input); //cookies map automatically null reh jayega.
        setParsedCookies(input); //cookies map ke alawa kuch touch nhi karega.
    }

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

        try {
            switch (action.clause) {
                case "create":
                    user.createInfo(action.description, action.zkpwdhash);
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