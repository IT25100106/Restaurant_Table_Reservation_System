package com.restaurant.repository;

import com.restaurant.model.Order;
import com.restaurant.util.FileHandler;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class OrderRepository {

    private static final String FILE = "orders.txt";

    public Order save(Order order) {
        if (order.getId() == null || order.getId().isBlank()) {
            order.setId(FileHandler.generateNextId(FILE));
            FileHandler.appendLine(FILE, order.toFileLine());
        } else {
            FileHandler.updateLine(FILE, order.getId(), order.toFileLine());
        }
        return order;
    }

    public List<Order> findAll() {
        List<Order> list = new ArrayList<>();
        for (String line : FileHandler.readLines(FILE)) {
            list.add(Order.fromFileLine(line));
        }
        return list;
    }

    public Optional<Order> findById(String id) {
        String line = FileHandler.findById(FILE, id);
        return line != null ? Optional.of(Order.fromFileLine(line)) : Optional.empty();
    }

    public List<Order> findByUserId(String userId) {
        List<Order> result = new ArrayList<>();
        for (Order o : findAll()) {
            if (userId.equals(o.getUserId())) result.add(o);
        }
        return result;
    }

    public List<Order> findByStatus(String status) {
        List<Order> result = new ArrayList<>();
        for (Order o : findAll()) {
            if (status.equalsIgnoreCase(o.getStatus())) result.add(o);
        }
        return result;
    }

    public boolean existsById(String id) {
        return FileHandler.existsById(FILE, id);
    }

    public boolean deleteById(String id) {
        return FileHandler.deleteLine(FILE, id);
    }
}
