package com.restaurant.service;

import com.restaurant.model.RestaurantTable;
import com.restaurant.model.VIPTable;
import com.restaurant.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    public RestaurantTable addRegularTable(int tableNumber, int capacity, String location) {
        if (tableRepository.existsByTableNumber(tableNumber)) {
            throw new RuntimeException("Table number already exists: " + tableNumber);
        }
        RestaurantTable table = new RestaurantTable(null, tableNumber, capacity, location);
        return tableRepository.save(table);
    }

    public RestaurantTable addVIPTable(int tableNumber, int capacity, String location,
                                       String amenities, double minimumSpend) {
        if (tableRepository.existsByTableNumber(tableNumber)) {
            throw new RuntimeException("Table number already exists: " + tableNumber);
        }
        VIPTable table = new VIPTable(null, tableNumber, capacity, location, amenities, minimumSpend);
        return tableRepository.save(table);
    }

    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    public List<RestaurantTable> getAvailableTables() {
        return tableRepository.findByStatus("AVAILABLE");
    }

    public RestaurantTable getTableById(String id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found: " + id));
    }

    public RestaurantTable updateTable(String id, Integer capacity, String location, String status) {
        RestaurantTable table = getTableById(id);
        if (capacity != null) table.setCapacity(capacity);
        if (location != null && !location.isBlank()) table.setLocation(location);
        if (status != null && !status.isBlank()) table.setStatus(status);
        return tableRepository.save(table);
    }

    public void deleteTable(String id) {
        if (!tableRepository.existsById(id)) {
            throw new RuntimeException("Table not found: " + id);
        }
        tableRepository.deleteById(id);
    }
}
