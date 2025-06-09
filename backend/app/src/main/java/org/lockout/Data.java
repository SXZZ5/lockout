package org.lockout;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.List;

@DynamoDbBean
public class Data {
   private String email;
   private String password;
   private List<Info> userdata;
   private String sessiontoken;
   private Long sessiontime;

   @DynamoDbPartitionKey
   public String getEmail() {
      return email;
   }
   
   @Override
   public String toString(){
       return "email: " + email + "\n password: " + password + "\n sessiontoken: " + sessiontoken;
   }

   /*generate code starts*/
   public Data() { }
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

   public void setPassword(String password){
      this.password = password;
   }

   public String getPassword(){
      return this.password;
   }
   /*generated code ends*/
}

