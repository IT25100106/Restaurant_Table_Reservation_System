package com.restaurant.model;

public class VIPTable extends RestaurantTable {

    private String amenities;
    private double minimumSpend;


    public VIPTable() {
        super();
    }

    public VIPTable(String id, int tableNumber, int capacity, String location,
                    String amenities, double minimumSpend) {
        super(id, tableNumber, capacity, location);
        this.amenities    = amenities;
        this.minimumSpend = minimumSpend;
    }

    public VIPTable(String id, int tableNumber, int capacity, String status,
                    String location, String amenities, double minimumSpend) {
        super(id, tableNumber, capacity, status, location);
        this.amenities    = amenities;
        this.minimumSpend = minimumSpend;
    }


    @Override
    public String getType() {
        return "vip";
    }

    @Override
    public String getDisplayName() {
        return "VIP Table " + getTableNumber();
    }


    @Override
    public String toFileLine() {
        return getId() + "|" + getTableNumber() + "|" + getCapacity() + "|"
                + getStatus() + "|" + getLocation() + "|vip|"
                + (amenities != null ? amenities : "") + "|" + minimumSpend;
    }

    public String getAmenities()               { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public double getMinimumSpend()                { return minimumSpend; }
    public void setMinimumSpend(double minimumSpend) { this.minimumSpend = minimumSpend; }
}
