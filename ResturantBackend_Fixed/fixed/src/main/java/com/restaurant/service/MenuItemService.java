package com.restaurant.service;

import com.restaurant.model.MenuItem;
import com.restaurant.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public MenuItem addMenuItem(String name, String description, double price,
                                String category, String imageUrl) {
        MenuItem item = new MenuItem(null, name, description, price, category, imageUrl);
        return menuItemRepository.save(item);
    }

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + id));
    }

    public Map<String, List<MenuItem>> getMenuGroupedByCategory() {
        Map<String, List<MenuItem>> grouped = new LinkedHashMap<>();
        for (MenuItem item : menuItemRepository.findAll()) {
            grouped.computeIfAbsent(item.getCategory(), k -> new ArrayList<>()).add(item);
        }
        return grouped;
    }

    public MenuItem updateMenuItem(String id, String name, String description,
                                   Double price, Boolean available) {
        MenuItem item = getMenuItemById(id);
        if (name != null && !name.isBlank()) item.setName(name);
        if (description != null) item.setDescription(description);
        if (price != null) item.setPrice(price);
        if (available != null) item.setAvailable(available);
        return menuItemRepository.save(item);
    }

    public void deleteMenuItem(String id) {
        if (!menuItemRepository.existsById(id)) {
            throw new RuntimeException("Menu item not found: " + id);
        }
        menuItemRepository.deleteById(id);
    }
}
