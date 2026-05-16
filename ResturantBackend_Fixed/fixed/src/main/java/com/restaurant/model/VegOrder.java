package com.restaurant.model;

public class VegOrder extends Order {

    public VegOrder() {
        super();
        setOrderType("veg");
    }

    public VegOrder(String id, String userId, String userName,
                    String reservationId, String itemsSummary, double totalPrice) {
        super(id, userId, userName, reservationId, "veg", itemsSummary, totalPrice);
    }
}
