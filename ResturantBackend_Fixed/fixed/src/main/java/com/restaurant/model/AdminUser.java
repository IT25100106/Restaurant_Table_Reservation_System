package com.restaurant.model;

public class AdminUser extends User {

    // Extra field only admins have
    private String permissions;

    public AdminUser() {
        super();
        this.permissions = "manage_users,manage_tables,manage_reservations,manage_orders,manage_reviews";
    }

    public AdminUser(String id, String name, String email, String password) {
        super(id, name, email, password);
        this.permissions = "manage_users,manage_tables,manage_reservations,manage_orders,manage_reviews";
    }


    @Override
    public String getRole() {
        return "admin";   // Different from User.getRole() which returns "user"
    }

    @Override
    public String display() {
        return "Admin: " + getName() + " (" + getEmail() + ")";
    }

    // =====================================================
    // Admin-specific behaviour
    // =====================================================

    public boolean hasPermission(String permission) {
        if (permissions == null) return false;
        return permissions.contains(permission);
    }

    // Getters / Setters
    public String getPermissions()               { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }
}
