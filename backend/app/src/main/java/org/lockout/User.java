package org.lockout;

import java.time.Instant;
import java.util.List;

public class User {

    String email;
    String password;
    String sessiontoken;
    Data dbuser;

    public boolean create(String sessiontoken) {
        try {
            Dbops.makeUser(this, sessiontoken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean userAlreadyExists() {
        try {
            Dbops.getUser(this);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean verifyCredentials(String sessiontoken) {
        try {
            this.dbuser = Dbops.getUser(this);
            Glogger.log(dbuser.toString());
            // returns true or false depending on whether password is correct or not.
            if (AppUtils.verifyPassword(this.password, dbuser.getPassword())) {
                Dbops.updateUserSession(this, sessiontoken);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            Glogger.log("User not found " + e.toString());
            return false;
        }
    }

    public void concealDbuser() {
        for (Info item : dbuser.getUserdata()) {
            if (!AppUtils.hasTimeElapsedHours(item.getEpochTime(), item.getCooldownHours())) {
                Instant minviewtime = Instant.ofEpochMilli(item.getEpochTime());
                minviewtime = minviewtime.plusSeconds(item.getCooldownHours()*60*60);
                Long tmp = minviewtime.toEpochMilli();
                item.setPwdhash(tmp.toString());
            }
        }
    }

    public boolean verifySession() {
        try {
            this.dbuser = Dbops.getUser(this);
            Glogger.log(dbuser.toString());
            if (AppUtils.verifyPassword(this.sessiontoken, dbuser.getSessiontoken())) {
                return !AppUtils.hasTimeElapsedMinutes(this.dbuser.getSessiontime(), 4);
            } else {
                return false;
            }
        } catch (Exception e) {
            Glogger.log("User not found " + e.toString());
            return false;
        }
    }

    public void createInfo(String description, String zkpwdhash) throws Exception {
        for (Info item : dbuser.getUserdata()) {
            if (item.getDescription().equals(description)) {
                throw new RuntimeException("Provided descriptor already exists");
            }
        }

        Info newinfo = new Info();
        newinfo.setDescription(description);
        newinfo.setPwdhash(zkpwdhash);
        newinfo.setEpochTime(Instant.now().toEpochMilli());
        newinfo.setCooldownHours(7);

        dbuser.getUserdata().add(newinfo);
        Dbops.updateUserInfo(this);
    }

    public void deleteInfo(String description) throws Exception {
        List<Info> l = dbuser.getUserdata();
        int idxtodelete = -1;
        for (int i = 0; i < l.size(); ++i) {
            Info item = l.get(i);
            if (item.getDescription().equals(description)) {
                idxtodelete = i;
            }
        }
        if (idxtodelete == -1) {
            throw new RuntimeException("Provided descriptor does not exist");
        } else {
            l.remove(idxtodelete);
        }
        Dbops.updateUserInfo(this);
    }

    public void updateInfo(String description) throws Exception {
        List<Info> l = dbuser.getUserdata();
        for (Info item : l)
            if (item.getDescription().equals(description)) {
                item.setEpochTime(Instant.now().toEpochMilli());
            }
        Dbops.updateUserInfo(this);
    }


    @Override
    public String toString() {
        return "email: " + email + ",\n password: " + password + ",\n session: " + sessiontoken;
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String email, String password, String sessiontoken) {
        this.email = email;
        this.password = password;
        this.sessiontoken = sessiontoken;
    }

    /* generate code starts */
    public User() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSessiontoken() {
        return sessiontoken;
    }

    public void setSessiontoken(String sessiontoken) {
        this.sessiontoken = sessiontoken;
    }


    public Data getDbuser() {
        return dbuser;
    }

    public void setDbuser(Data dbuser) {
        this.dbuser = dbuser;
    }

    /* generate code ends */
}
