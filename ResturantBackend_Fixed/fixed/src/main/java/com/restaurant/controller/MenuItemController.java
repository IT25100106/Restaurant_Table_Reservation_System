package com.restaurant.controller;

import com.restaurant.model.MenuItem;
import com.restaurant.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class MenuItemController {

    @Autowired private MenuItemService menuItemService;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Map<String, Object> body) {
        try {
            MenuItem item = menuItemService.addMenuItem(
                    body.get("name").toString(),
                    body.getOrDefault("description", "").toString(),
                    Double.parseDouble(body.get("price").toString()),
                    body.get("category").toString(),
                    body.getOrDefault("imageUrl", "").toString()
            );
            return ResponseEntity.ok(Map.of("success", true, "menuItem", menuMap(item)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems().stream().map(this::menuMap).toList());
    }

    @GetMapping("/grouped")
    public ResponseEntity<?> getGrouped() {
        Map<String, List<MenuItem>> grouped = menuItemService.getMenuGroupedByCategory();
        Map<String, Object> result = new LinkedHashMap<>();
        grouped.forEach((cat, items) -> result.put(cat, items.stream().map(this::menuMap).toList()));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try { return ResponseEntity.ok(menuMap(menuItemService.getMenuItemById(id))); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Double price = body.get("price") != null ? Double.parseDouble(body.get("price").toString()) : null;
            Boolean available = body.get("available") != null ? Boolean.parseBoolean(body.get("available").toString()) : null;
            MenuItem item = menuItemService.updateMenuItem(id,
                    body.get("name") != null ? body.get("name").toString() : null,
                    body.get("description") != null ? body.get("description").toString() : null,
                    price, available);
            return ResponseEntity.ok(Map.of("success", true, "menuItem", menuMap(item)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try { menuItemService.deleteMenuItem(id); return ResponseEntity.ok(Map.of("success", true)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    private Map<String, Object> menuMap(MenuItem m) {
        return Map.of("id", m.getId(), "name", m.getName(),
                "description", m.getDescription() != null ? m.getDescription() : "",
                "price", m.getPrice(), "category", m.getCategory(),
                "imageUrl", m.getImageUrl() != null ? m.getImageUrl() : "",
                "available", m.isAvailable());
    }
}
