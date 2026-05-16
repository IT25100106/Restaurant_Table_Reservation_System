package com.restaurant.repository;

import com.restaurant.model.User;
import com.restaurant.util.FileHandler;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private static final String FILE = "users.txt";

    public User save(User user) {
        if (user.getId() == null || user.getId().isBlank()) {
            // New user — generate ID and append
            user.setId(FileHandler.generateNextId(FILE));
            FileHandler.appendLine(FILE, user.toFileLine());
        } else {
            // Existing user — update line
            FileHandler.updateLine(FILE, user.getId(), user.toFileLine());
        }
        return user;
    }


    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        for (String line : FileHandler.readLines(FILE)) {
            users.add(User.fromFileLine(line));
        }
        return users;
    }

    public Optional<User> findById(String id) {
        String line = FileHandler.findById(FILE, id);
        return line != null ? Optional.of(User.fromFileLine(line)) : Optional.empty();
    }

    public Optional<User> findByEmail(String email) {
        for (String line : FileHandler.readLines(FILE)) {
            User user = User.fromFileLine(line);
            if (email.equalsIgnoreCase(user.getEmail())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    public boolean existsById(String id) {
        return FileHandler.existsById(FILE, id);
    }

    public List<User> findByNameContaining(String name) {
        List<User> result = new ArrayList<>();
        for (User user : findAll()) {
            if (user.getName().toLowerCase().contains(name.toLowerCase())) {
                result.add(user);
            }
        }
        return result;
    }


    public User update(User user) {
        FileHandler.updateLine(FILE, user.getId(), user.toFileLine());
        return user;
    }


    public boolean deleteById(String id) {
        return FileHandler.deleteLine(FILE, id);
    }
}
