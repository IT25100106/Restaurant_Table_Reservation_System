package com.restaurant.controller;

import com.restaurant.model.Reservation;
import com.restaurant.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReservationController {

    @Autowired private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Reservation r = reservationService.createReservation(
                    body.get("userId").toString(),
                    body.get("userName").toString(),
                    body.get("tableId").toString(),
                    Integer.parseInt(body.get("tableNumber").toString()),
                    body.get("date").toString(),
                    body.get("time").toString(),
                    Integer.parseInt(body.get("partySize").toString()),
                    body.getOrDefault("specialRequests", "").toString()
            );
            return ResponseEntity.ok(Map.of("success", true, "reservation", resMap(r)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(reservationService.getAllReservations().stream().map(this::resMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try { return ResponseEntity.ok(resMap(reservationService.getReservationById(id))); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId).stream().map(this::resMap).toList());
    }

    @GetMapping("/available")
    public ResponseEntity<?> checkAvailability(@RequestParam String tableId,
                                               @RequestParam String date,
                                               @RequestParam String time) {
        boolean available = reservationService.isTableAvailable(tableId, date, time);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Integer partySize = body.get("partySize") != null ? Integer.parseInt(body.get("partySize").toString()) : null;
            Reservation r = reservationService.updateReservation(id,
                    body.get("date") != null ? body.get("date").toString() : null,
                    body.get("time") != null ? body.get("time").toString() : null,
                    partySize,
                    body.get("specialRequests") != null ? body.get("specialRequests").toString() : null);
            return ResponseEntity.ok(Map.of("success", true, "reservation", resMap(r)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String id) {
        try { return ResponseEntity.ok(resMap(reservationService.confirmReservation(id))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        try { return ResponseEntity.ok(resMap(reservationService.cancelReservation(id))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable String id) {
        try { return ResponseEntity.ok(resMap(reservationService.completeReservation(id))); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try { reservationService.deleteReservation(id); return ResponseEntity.ok(Map.of("success", true)); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); }
    }

    private Map<String, Object> resMap(Reservation r) {
        return Map.of("id", r.getId(), "userId", r.getUserId(), "userName", r.getUserName(),
                "tableId", r.getTableId(), "tableNumber", r.getTableNumber(),
                "date", r.getDate(), "time", r.getTime(), "partySize", r.getPartySize(),
                "status", r.getStatus(), "specialRequests", r.getSpecialRequests() != null ? r.getSpecialRequests() : "");
    }
}
