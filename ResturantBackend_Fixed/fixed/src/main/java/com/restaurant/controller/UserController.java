package com.restaurant.controller;

import com.restaurant.model.User;
import com.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    @Autowired private UserService userService;

    @PostMapping("/users/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            boolean isAdmin = "true".equalsIgnoreCase(body.getOrDefault("isAdmin", "false"));
            User user = isAdmin
                    ? userService.registerAdmin(body.get("name"), body.get("email"), body.get("password"))
                    : userService.registerCustomer(body.get("name"), body.get("email"), body.get("password"));
            return ResponseEntity.ok(Map.of("success", true, "message", "Registration successful", "user", safe(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            User user = userService.login(body.get("email"), body.get("password"));
            return ResponseEntity.ok(Map.of("success", true, "message", "Login successful", "user", safe(user)));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(this::safe).toList());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try { return ResponseEntity.ok(safe(userService.getUserById(id))); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @GetMapping("/users/search")
    public ResponseEntity<?> search(@RequestParam String name) {
        return ResponseEntity.ok(userService.searchByName(name).stream().map(this::safe).toList());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            User u = userService.updateUser(id, body.get("name"), body.get("email"), body.get("password"));
            return ResponseEntity.ok(Map.of("success", true, "user", safe(u)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try { userService.deleteUser(id); return ResponseEntity.ok(Map.of("success", true)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage())); }
    }

    private Map<String, Object> safe(User u) {
        return Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(),
                "role", u.getRole(), "display", u.display(),
                "createdAt", u.getCreatedAt() != null ? u.getCreatedAt() : "");
    }
}
