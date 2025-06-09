package org.lockout;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

import java.time.Instant;

@DynamoDbBean
public class Info {
    private String description;
    private String pwdhash;
    private Long epochTime;
    private Integer cooldownHours;

    public Info() {

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

