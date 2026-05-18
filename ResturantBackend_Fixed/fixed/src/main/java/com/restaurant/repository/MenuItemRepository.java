package com.restaurant.repository;

import com.restaurant.model.MenuItem;
import com.restaurant.util.FileHandler;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class MenuItemRepository {

    private static final String FILE = "menu.txt";

    public MenuItem save(MenuItem item) {
        if (item.getId() == null || item.getId().isBlank()) {
            item.setId(FileHandler.generateNextId(FILE));
            FileHandler.appendLine(FILE, item.toFileLine());
        } else {
            FileHandler.updateLine(FILE, item.getId(), item.toFileLine());
        }
        return item;
    }

    public List<MenuItem> findAll() {
        List<MenuItem> list = new ArrayList<>();
        for (String line : FileHandler.readLines(FILE)) {
            list.add(MenuItem.fromFileLine(line));
        }
        return list;
    }

    public Optional<MenuItem> findById(String id) {
        String line = FileHandler.findById(FILE, id);
        return line != null ? Optional.of(MenuItem.fromFileLine(line)) : Optional.empty();
    }

    public List<MenuItem> findByCategory(String category) {
        List<MenuItem> result = new ArrayList<>();
        for (MenuItem m : findAll()) {
            if (category.equalsIgnoreCase(m.getCategory())) result.add(m);
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
