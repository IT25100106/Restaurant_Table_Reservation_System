package com.restaurant.service;

import com.restaurant.model.NonVegOrder;
import com.restaurant.model.Order;
import com.restaurant.model.VegOrder;
import com.restaurant.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(String userId, String userName, String reservationId,
                             String orderType, List<Map<String, Object>> items) {
        StringBuilder summary = new StringBuilder();
        double total = 0;
        if (items != null) {
            for (Map<String, Object> item : items) {
                String name = item.getOrDefault("name", "Item").toString();
                double price = Double.parseDouble(item.getOrDefault("price", "0").toString());
                int qty = Integer.parseInt(item.getOrDefault("quantity", "1").toString());
                total += price * qty;
                if (summary.length() > 0) summary.append(", ");
                summary.append(qty).append("x ").append(name);
            }
        }

        Order order;
        if ("veg".equalsIgnoreCase(orderType)) {
            order = new VegOrder(null, userId, userName, reservationId, summary.toString(), total);
        } else {
            order = new NonVegOrder(null, userId, userName, reservationId, summary.toString(), total);
        }
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order updateOrderStatus(String id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }

    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found: " + id);
        }
        orderRepository.deleteById(id);
    }
}
