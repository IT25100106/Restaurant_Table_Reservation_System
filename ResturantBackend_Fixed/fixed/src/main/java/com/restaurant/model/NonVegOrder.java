package com.restaurant.model;


public class NonVegOrder extends Order {

    public NonVegOrder() {
        super();
        setOrderType("nonveg");
    }

    public NonVegOrder(String id, String userId, String userName,
                       String reservationId, String itemsSummary, double totalPrice) {
        super(id, userId, userName, reservationId, "nonveg", itemsSummary, totalPrice);
    }
}
