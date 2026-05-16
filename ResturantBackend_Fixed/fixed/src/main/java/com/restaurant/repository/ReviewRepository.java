package com.restaurant.repository;

import com.restaurant.model.Review;
import com.restaurant.util.FileHandler;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class ReviewRepository {

    private static final String FILE = "reviews.txt";

    public Review save(Review review) {
        if (review.getId() == null || review.getId().isBlank()) {
            review.setId(FileHandler.generateNextId(FILE));
            FileHandler.appendLine(FILE, review.toFileLine());
        } else {
            FileHandler.updateLine(FILE, review.getId(), review.toFileLine());
        }
        return review;
    }

    public List<Review> findAll() {
        List<Review> list = new ArrayList<>();
        for (String line : FileHandler.readLines(FILE)) {
            list.add(Review.fromFileLine(line));
        }
        return list;
    }

    public Optional<Review> findById(String id) {
        String line = FileHandler.findById(FILE, id);
        return line != null ? Optional.of(Review.fromFileLine(line)) : Optional.empty();
    }

    public List<Review> findByUserId(String userId) {
        List<Review> result = new ArrayList<>();
        for (Review r : findAll()) {
            if (userId.equals(r.getUserId())) result.add(r);
        }
        return result;
    }

    public double getAverageRating() {
        List<Review> all = findAll();
        if (all.isEmpty()) return 0;
        double sum = all.stream().mapToInt(Review::getRating).sum();
        return Math.round((sum / all.size()) * 10.0) / 10.0;
    }

    public boolean existsById(String id) {
        return FileHandler.existsById(FILE, id);
    }

    public boolean deleteById(String id) {
        return FileHandler.deleteLine(FILE, id);
    }
}
