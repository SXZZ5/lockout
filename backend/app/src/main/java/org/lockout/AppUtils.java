package org.lockout;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import java.security.SecureRandom;
import java.time.Instant;

/**
 * Some static utility functions defined here.
 */
public class AppUtils {
    static final Argon2PasswordEncoder
            encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    static final SecureRandom
            rngen = new SecureRandom(SecureRandom.getSeed(32));

    /**
     * Password hashing using Argon2
     * @param password
     * @return hashed password
     */
    public static String hashpassword(String password){
        assert password != null;
        return encoder.encode(password);
    }

    /**
     * Validates password against hash (Argon2)
     * @param password
     * @param hash
     * @return
     */
    public static boolean verifyPassword(String password, String hash){
        return encoder.matches(password,hash);
    }

    /**
     * Generate a random number using SecureRandom.
     * primarily for generating cookies.
     * @return
     */
    public static Integer generateSession(){
        return rngen.nextInt();
    }

    /**
     * Check if `minhrs` hours have elapsed or not
     * primarily for checking cooldowns.
     * @param epochtime the reference time "since" when (unix epoch time)
     * @param minhrs the minimum time IN HOURS we require to have elapsed for function to return true
     * @return true or false
     */
    public static boolean hasTimeElapsedHours(Long epochtime, int minhrs) {
        Instant curtime = Instant.now();
        Instant gottime = Instant.ofEpochMilli(epochtime);
        Instant minviewtime = gottime.plusSeconds(minhrs * 60 * 60);
        Instant maxviewtime = minviewtime.plusSeconds(1*60*60);
        if(curtime.isBefore(minviewtime)){
            return false;
        } else {
            return true;
        }
    }

    /**
     * Check whether `minreq` minutes have elapsed or not since some time
     * primarily for invalidating cookies after few minutes.
     * @param epochtime the reference time "since" when (unix epoch time)
     * @param minreq the minimum time IN MINUTES we require to have elapsed for function to return true
     * @return yes minreq minutes have elapsed or no minreq minutes have not elapsed
     */
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
