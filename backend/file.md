[toc]



- authenticate users
- add users
- add passwords. 
- set time when password is retrievable. 

data model
- unique partition key: email LOGIN
- password hashed LOGIN
- Saved passwords
  - Description - password hashed - access requested time - cooldown time per password.

### Workflow

login/authentication if succesful return all stored password descriptions and acces times as response.

if signup then just generate the session and return that in response (probably in a cookie)

for logout just clear the session.

for retrieve request compare against current access time, either return the password or update access time and refuse to return the password.



### Implementation Details

#### information

Data class is our data model

make a standard ddb client, use it to make enhanced ddb client. Then use enhanced client to generate table model table (ddbt). Then in createActualTable create the table.

user ko token dena hoga. cookie se aaye token verify karne honge. database me rakhna hoga session token bhi. 

#### untitled 1

since dynamo db is basically about single table design. I have the entire user data as soon as I fetch the item from the table. 

you could keep two different tables one for only authentication and the other for appdata.

you can also create an index on the primary key only but not have the other app data included in the index. 

#### Dbops class

- holds dynamodb client stuff as static members and holds a user object as instance member. 
- making a new user and getting an old user are both behaviours. 
- if couldn't make new user, caller gets a null session integer return else it gets the actual assigned session integer return.

----

### Password stuff

- password ko generate hi backend pe karna is better so that in no case do I lose the password that the
user is setting. (network tab se read karne pe hi tula hai user hai agar tab to fir server ko password 
send karte samay bhi dekh hi lega, so lets ignore this concern)
- nhi but frontend pe karna = Zero Knowledge Architecture (backend literally NEVER sees the secret
and hence no worries of leaks)
- but do I want to take the time for it ? Apne liye bana rha hu ye app to mai na. Ye bhi hai ki frontend
to likhna hi padega otherwise how do you do the obscuring. 
- don't allow generating a new password for a case that has not been revealed yet. 
- password generated but not confirmed vs password confirmed. 
- revealed password ko highlight rakhna hai ki ye password revealed hai. 
- current time vs reveal window thingy. 
- On reveal, just show the thing. (email send karne wala idea isn't as useful because reveal window me 
website pe logon to karna hi padega user ko to fir dekh hi le na. Usefulness is a kindof backup though.)
- its better to just maintain some history in the db instead of doing all this emailing/downloading jazz.

class Secret {
    String identifier;
    Pwd[5] UnconfirmedPwds
    Pwd[5] ConfirmedPwds  
}

class Pwd {
    String key;
    Time created; 
    Integer cooldownHours;
}

Alternatively 
how about we obfuscate the revealed passwords as well. That way user does not necessarily have to create 
a new password after every reveal. 
also simplifies the data model. 
and we always generate a completely new entity of its own.
{description,timeInstant} => unique secret. 
User just generates a new secret the moment they desire and they can delete old useless secrets. 

### Auth
- i don't want to make a separate session store, I don't want to use JWTs. 
- entry endpoints me request ki body me email, pwd hai
- not