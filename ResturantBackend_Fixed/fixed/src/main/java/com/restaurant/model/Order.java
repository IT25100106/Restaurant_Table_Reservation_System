package com.restaurant.model;

import java.time.LocalDateTime;


public class Order {

    private String id;
    private String userId;
    private String userName;
    private String reservationId;
    private String orderType;
    private String itemsSummary;
    private String status;
    private double totalPrice;
    private String createdAt;

    public Order() {
        this.status    = "PENDING";
        this.createdAt = LocalDateTime.now().toString();
    }

    public Order(String id, String userId, String userName, String reservationId,
                 String orderType, String itemsSummary, double totalPrice) {
        this.id            = id;
        this.userId        = userId;
        this.userName      = userName;
        this.reservationId = reservationId;
        this.orderType     = orderType;
        this.itemsSummary  = itemsSummary;
        this.status        = "PENDING";
        this.totalPrice    = totalPrice;
        this.createdAt     = LocalDateTime.now().toString();
    }

    public String toFileLine() {
        return id + "|" + userId + "|" + userName + "|"
                + (reservationId != null ? reservationId : "") + "|"
                + orderType + "|"
                + (itemsSummary != null ? itemsSummary.replace("|", ";") : "") + "|"
                + status + "|" + totalPrice + "|" + createdAt;
    }

    public static Order fromFileLine(String line) {
        String[] p = line.split("\\|", -1);
        Order o = new Order();
        o.id            = p[0];
        o.userId        = p[1];
        o.userName      = p[2];
        o.reservationId = p.length > 3 ? p[3] : "";
        o.orderType     = p.length > 4 ? p[4] : "nonveg";
        o.itemsSummary  = p.length > 5 ? p[5] : "";
        o.status        = p.length > 6 ? p[6] : "PENDING";
        o.totalPrice    = p.length > 7 ? Double.parseDouble(p[7]) : 0;
        o.createdAt     = p.length > 8 ? p[8] : LocalDateTime.now().toString();
        return o;
    }

    public String getId()                          { return id; }
    public void setId(String id)                   { this.id = id; }
    public String getUserId()                      { return userId; }
    public void setUserId(String userId)           { this.userId = userId; }
    public String getUserName()                    { return userName; }
    public void setUserName(String userName)       { this.userName = userName; }
    public String getReservationId()               { return reservationId; }
    public void setReservationId(String r)         { this.reservationId = r; }
    public String getOrderType()                   { return orderType; }
    public void setOrderType(String orderType)     { this.orderType = orderType; }
    public String getItemsSummary()                { return itemsSummary; }
    public void setItemsSummary(String items)      { this.itemsSummary = items; }
    public String getStatus()                      { return status; }
    public void setStatus(String status)           { this.status = status; }
    public double getTotalPrice()                  { return totalPrice; }
    public void setTotalPrice(double totalPrice)   { this.totalPrice = totalPrice; }
    public String getCreatedAt()                   { return createdAt; }
    public void setCreatedAt(String createdAt)     { this.createdAt = createdAt; }
}
