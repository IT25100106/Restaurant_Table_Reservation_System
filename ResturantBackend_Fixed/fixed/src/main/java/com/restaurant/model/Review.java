package com.restaurant.model;

import java.time.LocalDateTime;

public class Review {

    private String id;
    private String userId;
    private String userName;
    private int    rating;
    private String comment;
    private String reservationId;
    private String createdAt;

    public Review() {
        this.createdAt = LocalDateTime.now().toString();
    }

    public Review(String id, String userId, String userName, int rating,
                  String comment, String reservationId) {
        this.id            = id;
        this.userId        = userId;
        this.userName      = userName;
        this.rating        = rating;
        this.comment       = comment;
        this.reservationId = reservationId;
        this.createdAt     = LocalDateTime.now().toString();
    }

    public String getReviewType() { return "regular"; }

    public String getDisplayFormat() {
        return userName + " rated " + rating + "/5: " + comment;
    }

    public String toFileLine() {
        String safeComment = comment != null ? comment.replace("|", ";").replace("\n", "\\n").replace("\r", "") : "";
        return id + "|" + userId + "|" + userName + "|" + rating + "|"
                + safeComment + "|"
                + (reservationId != null ? reservationId : "") + "|"
                + getReviewType() + "|" + createdAt;
    }

    public static Review fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        String type = p.length > 6 ? p[6] : "regular";
        Review r;
        if ("verified".equals(type)) {
            r = new VerifiedReview();
        } else {
            r = new Review();
        }
        r.id            = p[0];
        r.userId        = p[1];
        r.userName      = p[2];
        r.rating        = Integer.parseInt(p[3]);
        r.comment       = p.length > 4 ? p[4].replace("\\n", "\n") : "";
        r.reservationId = p.length > 5 ? p[5] : "";
        r.createdAt     = p.length > 7 ? p[7] : LocalDateTime.now().toString();
        return r;
    }

    public String getId()                          { return id; }
    public void setId(String id)                   { this.id = id; }
    public String getUserId()                      { return userId; }
    public void setUserId(String userId)           { this.userId = userId; }
    public String getUserName()                    { return userName; }
    public void setUserName(String userName)       { this.userName = userName; }
    public int getRating()                         { return rating; }
    public void setRating(int rating)              { this.rating = rating; }
    public String getComment()                     { return comment; }
    public void setComment(String comment)         { this.comment = comment; }
    public String getReservationId()               { return reservationId; }
    public void setReservationId(String r)         { this.reservationId = r; }
    public String getCreatedAt()                   { return createdAt; }
    public void setCreatedAt(String createdAt)     { this.createdAt = createdAt; }
}
