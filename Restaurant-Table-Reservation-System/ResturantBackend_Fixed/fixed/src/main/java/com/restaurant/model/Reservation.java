package com.restaurant.model;

import java.time.LocalDateTime;


public class Reservation {

    private String id;
    private String userId;
    private String userName;
    private String tableId;
    private int tableNumber;
    private String date;
    private String time;
    private int partySize;
    private String status;
    private String specialRequests;
    private String createdAt;


    public Reservation() {
        this.status    = "PENDING";
        this.createdAt = LocalDateTime.now().toString();
    }

    public Reservation(String id, String userId, String userName, String tableId,
                       int tableNumber, String date, String time, int partySize,
                       String specialRequests) {
        this.id              = id;
        this.userId          = userId;
        this.userName        = userName;
        this.tableId         = tableId;
        this.tableNumber     = tableNumber;
        this.date            = date;
        this.time            = time;
        this.partySize       = partySize;
        this.status          = "PENDING";
        this.specialRequests = specialRequests;
        this.createdAt       = LocalDateTime.now().toString();
    }


    public void confirm()  { this.status = "CONFIRMED"; }
    public void cancel()   { this.status = "CANCELLED"; }
    public void complete() { this.status = "COMPLETED"; }

    public boolean isActive() {
        return "PENDING".equals(status) || "CONFIRMED".equals(status);
    }



    public String toFileLine() {
        String safeRequests = specialRequests != null
                ? specialRequests.replace("|", ";")  // avoid breaking the separator
                : "";
        return id + "|" + userId + "|" + userName + "|" + tableId + "|" + tableNumber
                + "|" + date + "|" + time + "|" + partySize + "|" + status
                + "|" + safeRequests + "|" + createdAt;
    }

    public static Reservation fromFileLine(String line) {
        String[] p = line.split("\\|");
        Reservation r = new Reservation();
        r.id              = p[0];
        r.userId          = p[1];
        r.userName        = p[2];
        r.tableId         = p[3];
        r.tableNumber     = Integer.parseInt(p[4]);
        r.date            = p[5];
        r.time            = p[6];
        r.partySize       = Integer.parseInt(p[7]);
        r.status          = p[8];
        r.specialRequests = p.length > 9  ? p[9]  : "";
        r.createdAt       = p.length > 10 ? p[10] : LocalDateTime.now().toString();
        return r;
    }


    public String getId()        { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId()            { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName()              { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getTableId()             { return tableId; }
    public void setTableId(String tableId) { this.tableId = tableId; }

    public int getTableNumber()                { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

    public String getDate()          { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime()          { return time; }
    public void setTime(String time) { this.time = time; }

    public int getPartySize()              { return partySize; }
    public void setPartySize(int partySize) { this.partySize = partySize; }

    public String getStatus()            { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSpecialRequests()                   { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public String getCreatedAt()               { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
