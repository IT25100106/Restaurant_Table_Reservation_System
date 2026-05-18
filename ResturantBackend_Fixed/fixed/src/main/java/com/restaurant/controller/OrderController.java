package com.restaurant.controller;

import com.restaurant.model.Order;
import com.restaurant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrderController {

    @Autowired private OrderService orderService;

    @PostMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
            Order order = orderService.createOrder(
                    body.get("userId").toString(),
                    body.get("userName").toString(),
                    body.get("reservationId") != null ? body.get("reservationId").toString() : null,
                    body.getOrDefault("orderType", "nonveg").toString(),
                    items
            );
            return ResponseEntity.ok(Map.of("success", true, "order", orderMap(order)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(orderService.getAllOrders().stream().map(this::orderMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try { return ResponseEntity.ok(orderMap(orderService.getOrderById(id))); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId).stream().map(this::orderMap).toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            Order order = orderService.updateOrderStatus(id, body.get("status"));
            return ResponseEntity.ok(Map.of("success", true, "order", orderMap(order)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try { orderService.deleteOrder(id); return ResponseEntity.ok(Map.of("success", true)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    private Map<String, Object> orderMap(Order o) {
        return Map.of("id", o.getId(), "userId", o.getUserId(), "userName", o.getUserName(),
                "reservationId", o.getReservationId() != null ? o.getReservationId() : "",
                "orderType", o.getOrderType(),
                "itemsSummary", o.getItemsSummary() != null ? o.getItemsSummary() : "",
                "status", o.getStatus(), "totalPrice", o.getTotalPrice(), "createdAt", o.getCreatedAt());
    }
}
