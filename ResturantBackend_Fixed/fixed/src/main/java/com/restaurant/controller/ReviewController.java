package com.restaurant.controller;

import com.restaurant.model.Review;
import com.restaurant.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReviewController {

    @Autowired private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Review review = reviewService.createReview(
                    body.get("userId").toString(),
                    body.get("userName").toString(),
                    Integer.parseInt(body.get("rating").toString()),
                    body.get("comment").toString(),
                    body.get("reservationId") != null ? body.get("reservationId").toString() : null
            );
            return ResponseEntity.ok(Map.of("success", true, "review", reviewMap(review)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(reviewService.getAllReviews().stream().map(this::reviewMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try { return ResponseEntity.ok(reviewMap(reviewService.getReviewById(id))); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId).stream().map(this::reviewMap).toList());
    }

    @GetMapping("/average-rating")
    public ResponseEntity<?> getAverage() {
        return ResponseEntity.ok(Map.of("averageRating", reviewService.getAverageRating()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Integer rating = body.get("rating") != null ? Integer.parseInt(body.get("rating").toString()) : null;
            Review r = reviewService.updateReview(id, rating,
                    body.get("comment") != null ? body.get("comment").toString() : null);
            return ResponseEntity.ok(Map.of("success", true, "review", reviewMap(r)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try { reviewService.deleteReview(id); return ResponseEntity.ok(Map.of("success", true)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    private Map<String, Object> reviewMap(Review r) {
        return Map.of("id", r.getId(), "userId", r.getUserId(), "userName", r.getUserName(),
                "rating", r.getRating(), "comment", r.getComment(),
                "reservationId", r.getReservationId() != null ? r.getReservationId() : "",
                "reviewType", r.getReviewType(),
                "displayFormat", r.getDisplayFormat(),
                "createdAt", r.getCreatedAt());
    }
}
