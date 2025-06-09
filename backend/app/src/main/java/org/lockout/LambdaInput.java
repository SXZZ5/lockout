package org.lockout;
import java.util.Map;

public class LambdaInput {
    //FOR SOME REASON, AWS LAMBDA CONVERTS THE ENTIRE BODY INTO A STRING.
    private String body;
    private Map<String, String> queryStringParameters;
    private RequestContext requestContext;
    private Map<String,String> headers;
    //well its a subjective decision, but I think Cookies belong the UserRequest object instead.
    /*generate code starts*/

    public RequestContext getRequestContext() {
        return requestContext;
    }

    public void setRequestContext(RequestContext requestContext) {
        this.requestContext = requestContext;
    }

    public Map<String, String> getQueryStringParameters() {
        return queryStringParameters;
    }

    public void setQueryStringParameters(Map<String, String> queryStringParameters) {
        this.queryStringParameters = queryStringParameters;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
    
    public Map<String,String> getHeaders(){
      return headers;
    }
    
    public void setHeaders(Map<String,String> headers){
        this.headers = headers;
    }
    /*generated code ends*/

    @Override
    public String toString() {
        return """
                body: {%s}
                queryStringParameters: {%s}
                requestContext: {%s}
                """.formatted(body,queryStringParameters,requestContext);
    }
}

class RequestContext {
    record Http(String method, String path, String sourceIp){}
    private Http http;
    private String time;

    @Override
    public String toString() {
        return """
                method: %s,
                path: %s,
                sourceIp: %s,
                time: %s,
                """.formatted(http.method(), http.path(), http.sourceIp(),time);
    }

    /* generated code starts */
    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Http getHttp() {
        return http;
    }

    public void setHttp(Http http) {
        this.http = http;
    }
    /* generated code ends */
}
