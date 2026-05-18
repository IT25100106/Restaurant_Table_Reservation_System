package com.restaurant.model;

public class VerifiedReview extends Review {

    public VerifiedReview() { super(); }

    public VerifiedReview(String id, String userId, String userName, int rating,
                          String comment, String reservationId) {
        super(id, userId, userName, rating, comment, reservationId);
    }

    @Override
    public String getReviewType() { return "verified"; }

    @Override
    public String getDisplayFormat() {
        return "[Verified] " + getUserName() + " rated " + getRating() + "/5: " + getComment();
    }
}
