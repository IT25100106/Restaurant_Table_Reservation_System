package com.restaurant.model;

public class RestaurantTable {

    private String id;
    private int tableNumber;
    private int capacity;
    private String status;
    private String location;


    public RestaurantTable() {
        this.status = "AVAILABLE";
    }

    public RestaurantTable(String id, int tableNumber, int capacity, String location) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.location = location;
        this.status = "AVAILABLE";
    }

    public RestaurantTable(String id, int tableNumber, int capacity, String status, String location) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.status = status;
        this.location = location;
    }


    public String getType() {
        return "regular";
    }

    public String getDisplayName() {
        return "Table " + tableNumber;
    }


    public String toFileLine() {
        return id + "|" + tableNumber + "|" + capacity + "|" + status + "|" + location + "|" + getType();
    }


    public static RestaurantTable fromFileLine(String line) {
        String[] p = line.split("\\|");
        String type = p.length > 5 ? p[5] : "regular";

        if ("vip".equals(type)) {
            String amenities   = p.length > 6 ? p[6] : "";
            double minSpend    = p.length > 7 ? Double.parseDouble(p[7]) : 0;
            return new VIPTable(p[0], Integer.parseInt(p[1]), Integer.parseInt(p[2]),
                    p[3], p[4], amenities, minSpend);
        }

        return new RestaurantTable(p[0], Integer.parseInt(p[1]), Integer.parseInt(p[2]), p[3], p[4]);
    }


    public String getId()        { return id; }
    public void setId(String id) { this.id = id; }

    public int getTableNumber()              { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }

    public int getCapacity()           { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getStatus()            { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocation()              { return location; }
    public void setLocation(String location) { this.location = location; }
}
