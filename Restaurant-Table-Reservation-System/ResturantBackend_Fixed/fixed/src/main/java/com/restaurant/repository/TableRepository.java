package com.restaurant.repository;

import com.restaurant.model.RestaurantTable;
import com.restaurant.util.FileHandler;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class TableRepository {

    private static final String FILE = "tables.txt";

    public RestaurantTable save(RestaurantTable table) {
        if (table.getId() == null || table.getId().isBlank()) {
            table.setId(FileHandler.generateNextId(FILE));
            FileHandler.appendLine(FILE, table.toFileLine());
        } else {
            FileHandler.updateLine(FILE, table.getId(), table.toFileLine());
        }
        return table;
    }

    public List<RestaurantTable> findAll() {
        List<RestaurantTable> tables = new ArrayList<>();
        for (String line : FileHandler.readLines(FILE)) {
            tables.add(RestaurantTable.fromFileLine(line));
        }
        return tables;
    }

    public Optional<RestaurantTable> findById(String id) {
        String line = FileHandler.findById(FILE, id);
        return line != null ? Optional.of(RestaurantTable.fromFileLine(line)) : Optional.empty();
    }

    public boolean existsByTableNumber(int tableNumber) {
        for (RestaurantTable t : findAll()) {
            if (t.getTableNumber() == tableNumber) return true;
        }
        return false;
    }

    public List<RestaurantTable> findByStatus(String status) {
        List<RestaurantTable> result = new ArrayList<>();
        for (RestaurantTable t : findAll()) {
            if (status.equalsIgnoreCase(t.getStatus())) result.add(t);
        }
        return result;
    }

    public boolean existsById(String id) {
        return FileHandler.existsById(FILE, id);
    }

    public RestaurantTable update(RestaurantTable table) {
        FileHandler.updateLine(FILE, table.getId(), table.toFileLine());
        return table;
    }

    public boolean deleteById(String id) {
        return FileHandler.deleteLine(FILE, id);
    }
}
