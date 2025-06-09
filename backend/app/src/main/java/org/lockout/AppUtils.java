package org.lockout;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import java.security.SecureRandom;
import java.time.Instant;

public class AppUtils {
    static final Argon2PasswordEncoder
            encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    static final SecureRandom
            rngen = new SecureRandom(SecureRandom.getSeed(32));

    public static String hashpassword(String password){
        assert password != null;
//        return password + "dummyhash";
        return encoder.encode(password);
    }

    public static boolean verifyPassword(String password, String hash){
        return encoder.matches(password,hash);
    }

    public static Integer generateSession(){
        return rngen.nextInt();
    }

    public static boolean hasTimeElapsedHours(Long epochtime, int minhrs) {
        Instant curtime = Instant.now();
        Instant gottime = Instant.ofEpochMilli(epochtime);
        Instant minviewtime = gottime.plusSeconds(minhrs * 60 * 60);
        Instant maxviewtime = minviewtime.plusSeconds(1*60*60);
        if(curtime.isBefore(minviewtime)){
            return false;
        } else if(curtime.isAfter(maxviewtime)){
            return false;
        } else {
            return true;
        }
    }

    public static boolean hasTimeElapsedMinutes(Long epochtime, int minreq) {
        Instant curtime = Instant.now();
        Instant gottime = Instant.ofEpochMilli(epochtime);
        Glogger.log("curtime: " + curtime + ", gottime: " + gottime);
        gottime = gottime.plusSeconds(minreq * 60);
        Glogger.log("adjusted gottime: " + gottime);
        if(curtime.isBefore(gottime)){
            return false;
        } else {
            return true;
        }
    }
}
