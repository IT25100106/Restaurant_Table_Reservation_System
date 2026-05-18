package com.restaurant.model;

import java.time.LocalDateTime;


public class MenuItem {

    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String imageUrl;
    private boolean available;
    private String createdAt;

    public MenuItem() {
        this.available = true;
        this.createdAt = LocalDateTime.now().toString();
    }

    public MenuItem(String id, String name, String description, double price,
                    String category, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.available = true;
        this.createdAt = LocalDateTime.now().toString();
    }

    public String toFileLine() {
        return id + "|" + name + "|" + (description != null ? description : "") + "|"
                + price + "|" + category + "|" + (imageUrl != null ? imageUrl : "") + "|"
                + available + "|" + createdAt;
    }

    public static MenuItem fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        MenuItem m = new MenuItem();
        m.id          = p[0];
        m.name        = p[1];
        m.description = p.length > 2 ? p[2] : "";
        m.price       = p.length > 3 ? Double.parseDouble(p[3]) : 0;
        m.category    = p.length > 4 ? p[4] : "";
        m.imageUrl    = p.length > 5 ? p[5] : "";
        m.available   = p.length <= 6 || Boolean.parseBoolean(p[6]);
        m.createdAt   = p.length > 7 ? p[7] : LocalDateTime.now().toString();
        return m;
    }

    public String getId()                        { return id; }
    public void setId(String id)                 { this.id = id; }
    public String getName()                      { return name; }
    public void setName(String name)             { this.name = name; }
    public String getDescription()               { return description; }
    public void setDescription(String d)         { this.description = d; }
    public double getPrice()                     { return price; }
    public void setPrice(double price)           { this.price = price; }
    public String getCategory()                  { return category; }
    public void setCategory(String category)     { this.category = category; }
    public String getImageUrl()                  { return imageUrl; }
    public void setImageUrl(String imageUrl)     { this.imageUrl = imageUrl; }
    public boolean isAvailable()                 { return available; }
    public void setAvailable(boolean available)  { this.available = available; }
    public String getCreatedAt()                 { return createdAt; }
    public void setCreatedAt(String createdAt)   { this.createdAt = createdAt; }
}
