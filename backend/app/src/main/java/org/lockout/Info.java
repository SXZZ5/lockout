package org.lockout;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

import java.time.Instant;

/**
 * Represents 1 Secret
 */
@DynamoDbBean
public class Info {
    /**
     * Name of the secret as assigned by the user.
     * Will be Enforced to be unique by refusing to insert if exists.
     */
    private String description;
    /**
     * The hash for the pwd. Actually bad naming.
     * Its the encrypted form and not hashed form.
     * Not actually encrypted either though.
     * TODO: Actually do the encryption (dar lagta hai kuch gadbad na kardu aur pwd corrupt ho jaye)
     */
    private String pwdhash;
    /**
     * From the frontend.
     * The weird sequence of characters with backspaces mixed in.
     * Storing just for safety against a bug where the obfuscated sequence
     * does not evaluate to what the password should have been.
     */
    private String obfuscated;
    /**
     * Epoch time for the latest reveal request timing for this secret or any updates to this secret.
     * Initialised with creation time for new secrets.
     */
    private Long epochTime;
    /**
     * Minimum time in hours that user will be made to wait before actually revealing
     * the password to them.
     * Defaults to 7 hours.
     * Frontend does not yet have option to tweak this default of 7 hours.
     */
    private Integer cooldownHours;

    public Info() {

    }

    public String getObfuscated() {
        return obfuscated;
    }

    public void setObfuscated(String obfuscated) {
        this.obfuscated = obfuscated;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCooldownHours() {
        return cooldownHours;
    }

    public void setCooldownHours(Integer cooldownHours) {
        this.cooldownHours = cooldownHours;
    }

    public String getPwdhash() {
        return pwdhash;
    }

    public void setPwdhash(String pwdhash) {
        this.pwdhash = pwdhash;
    }

    public Long getEpochTime() {
        return epochTime;
    }

    public void setEpochTime(Long epochTime) {
        this.epochTime = epochTime;
    }
}

