package com.restaurant.model;

import java.time.LocalDateTime;

public class User {

    private String id;
    private String name;
    private String email;
    private String password;
    private String createdAt;


    public User() {
        this.createdAt = LocalDateTime.now().toString();
    }

    public User(String id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now().toString();
    }

    public User(String id, String name, String email, String password, String createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }


    public String getRole() {
        return "user";
    }

    public String display() {
        return name + " (" + email + ")";
    }


    public String toFileLine() {
        String safeName = name != null ? name.replace("|", ";").replace("\n", "\\n").replace("\r", "") : "";
        String safeEmail = email != null ? email.replace("|", ";").replace("\n", "").replace("\r", "") : "";
        String safePass = password != null ? password.replace("|", ";").replace("\n", "").replace("\r", "") : "";
        return id + "|" + safeName + "|" + safeEmail + "|" + safePass + "|" + getRole() + "|" + createdAt;
    }

    public static User fromFileLine(String line) {
        String[] parts = line.split("\\|");
        // parts[0]=id, [1]=name, [2]=email, [3]=password, [4]=role, [5]=createdAt
        String id = parts[0];
        String name = parts.length > 1 ? parts[1].replace("\\n", "\n") : "";
        String email = parts.length > 2 ? parts[2] : "";
        String password = parts.length > 3 ? parts[3] : "";
        String role = parts.length > 4 ? parts[4] : "customer";
        String createdAt = parts.length > 5 ? parts[5] : LocalDateTime.now().toString();

        if ("admin".equals(role)) {
            AdminUser admin = new AdminUser(id, name, email, password);
            admin.setCreatedAt(createdAt);
            return admin;
        } else {
            return new User(id, name, email, password, createdAt);
        }
    }


    public String getId()       { return id; }
    public void setId(String id) { this.id = id; }

    public String getName()          { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail()           { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword()              { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCreatedAt()               { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
