
package org.lockout;

/**
 *
 * @author Sushi
 */

import com.amazonaws.services.lambda.runtime.LambdaLogger;

/**
 * Just a Global logger wrapping LambdaLogger class from AWS.
 */
public class Glogger {
    static LambdaLogger logger;
    public static void setLogger(LambdaLogger logger) {
        Glogger.logger = logger;
    }
    public static void log(String str){
        logger.log(str);
    }
    public Glogger(){}
  
}
