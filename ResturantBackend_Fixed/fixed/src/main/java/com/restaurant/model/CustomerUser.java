package com.restaurant.model;


public class CustomerUser extends User {

    private String phone;

    public CustomerUser() { super(); }

    public CustomerUser(String id, String name, String email, String password) {
        super(id, name, email, password);
    }

    public CustomerUser(String id, String name, String email, String password, String phone) {
        super(id, name, email, password);
        this.phone = phone;
    }


    @Override
    public String getRole() {
        return "customer";
    }

    @Override
    public String display() {
        return getName() + " [Customer] (" + getEmail() + ")";
    }

    public String getPhone()           { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
