package org.lockout;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import java.util.Map;

/**
 * Entry point for the lambda request cycle.
 * All HTTP requests are "Handled" or first received here.
 */
public class Handler implements RequestHandler<LambdaInput, Map<String,Object>> {
    // this block does initalisation of database stuff at class loading time.
    {
        Dbops.InitDdbModel();
        Dbops.CreateActualTableIfNeeded();
    }
    public Handler(){
        System.out.println("Hello constructor");
    }
    
    @Override
    public Map<String,Object> handleRequest(LambdaInput input, Context ctx) {
        //can't make input itself into a Map<String,Integer> because then json won't be parsed right.
        LambdaLogger logger = ctx.getLogger();

        //input dump to see the request that we have after the first "deserialisation" into
        //the LambdaInput type.
        logger.log(input.toString());

        String cookies = input.getHeaders().get("cookie");
        logger.log("cookies:" + cookies);
        Glogger.setLogger(logger);
        Router.logger = logger;
        Dbops.logger = logger;
        Router router = new Router(input);
        try {
            router.handleRoutes();
        } catch (Exception e) {
            logger.log("exception in router:" + e.toString());
        }
        return router.getResponse();
    }
}

