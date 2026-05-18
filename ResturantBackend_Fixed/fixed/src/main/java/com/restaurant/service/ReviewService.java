package com.restaurant.service;

import com.restaurant.model.Review;
import com.restaurant.model.VerifiedReview;
import com.restaurant.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(String userId, String userName, int rating,
                               String comment, String reservationId) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        Review review;
        if (reservationId != null && !reservationId.isBlank()) {
            review = new VerifiedReview(null, userId, userName, rating, comment, reservationId);
        } else {
            review = new Review(null, userId, userName, rating, comment, null);
        }
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }

    public List<Review> getUserReviews(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    public double getAverageRating() {
        return reviewRepository.getAverageRating();
    }

    public Review updateReview(String id, Integer rating, String comment) {
        Review review = getReviewById(id);
        if (rating != null) {
            if (rating < 1 || rating > 5) throw new RuntimeException("Rating must be 1–5");
            review.setRating(rating);
        }
        if (comment != null && !comment.isBlank()) review.setComment(comment);
        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found: " + id);
        }
        // comment
        reviewRepository.deleteById(id);
    }
}
