package com.restaurant.controller;

import com.restaurant.model.RestaurantTable;
import com.restaurant.model.VIPTable;
import com.restaurant.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TableController {

    @Autowired private TableService tableService;

    @PostMapping
    public ResponseEntity<?> addTable(@RequestBody Map<String, Object> body) {
        try {
            int tableNumber = Integer.parseInt(body.get("tableNumber").toString());
            int capacity    = Integer.parseInt(body.get("capacity").toString());
            String location = body.get("location").toString();
            boolean isVip   = "true".equalsIgnoreCase(body.getOrDefault("isVip", "false").toString());

            RestaurantTable table;
            if (isVip) {
                String amenities = body.getOrDefault("amenities", "").toString();
                double minSpend  = Double.parseDouble(body.getOrDefault("minimumSpend", "0").toString());
                table = tableService.addVIPTable(tableNumber, capacity, location, amenities, minSpend);
            } else {
                table = tableService.addRegularTable(tableNumber, capacity, location);
            }
            return ResponseEntity.ok(Map.of("success", true, "table", tableToMap(table)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables().stream().map(this::tableToMap).toList());
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailable() {
        return ResponseEntity.ok(tableService.getAvailableTables().stream().map(this::tableToMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTable(@PathVariable String id) {
        try { return ResponseEntity.ok(tableToMap(tableService.getTableById(id))); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTable(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Integer capacity = body.get("capacity") != null ? Integer.parseInt(body.get("capacity").toString()) : null;
            String location  = body.get("location") != null ? body.get("location").toString() : null;
            String status    = body.get("status") != null ? body.get("status").toString() : null;
            RestaurantTable t = tableService.updateTable(id, capacity, location, status);
            return ResponseEntity.ok(Map.of("success", true, "table", tableToMap(t)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable String id) {
        try { tableService.deleteTable(id); return ResponseEntity.ok(Map.of("success", true)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage())); }
    }

    private Map<String, Object> tableToMap(RestaurantTable t) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", t.getId());
        map.put("tableNumber", t.getTableNumber());
        map.put("capacity", t.getCapacity());
        map.put("status", t.getStatus());
        map.put("location", t.getLocation());
        map.put("type", t.getType());
        map.put("displayName", t.getDisplayName());
        if (t instanceof VIPTable vip) {
            map.put("amenities", vip.getAmenities());
            map.put("minimumSpend", vip.getMinimumSpend());
        }
        //return
        return map;
    }
}
