package org.lockout;

import com.amazonaws.services.lambda.runtime.LambdaLogger;

import java.util.Map;

public class Router {
    Map<String,Object> response;
    static LambdaLogger logger;

    LambdaInput input;
    
    public void handleRoutes () throws Exception {
        var requestContext = input.getRequestContext();
        var path = requestContext.getHttp().path();
        logger.log("path found" + path);
        switch (path) {
            case "/signup" -> {
                logger.log("Signup Route doing work");
                Signup signup = new Signup(input);
                logger.log("populated signup: " + signup.toString());
                this.response = signup.createUser();
            }
            case "/login" -> {
                Login login = new Login(input);
                logger.log("populated login: " + login.toString());
                this.response = login.verifyUserCredentials();
            }
            case "/getinfo" -> {
                Getinfo getinfo = new Getinfo(input);
                logger.log("populated getinfo: " + getinfo.toString());
                this.response = getinfo.verifyUserSession();
            }

            case "/updates" -> {
                Updates updates = new Updates(input);
                logger.log("populated updatePwd" + updates.toString());
                this.response = updates.updateUser();
            }
            default -> logger.log("no such route");
        }
    }

    public Map<String, Object> getResponse() {
        return this.response;
    }

    public Router() { }
    public Router(LambdaInput input) {
        this.input = input;
    }
}


