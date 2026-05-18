package com.restaurant.repository;

import com.restaurant.model.Reservation;
import com.restaurant.util.FileHandler;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ReservationRepository {

    private static final String FILE = "reservations.txt";

    public Reservation save(Reservation reservation) {
        if (reservation.getId() == null || reservation.getId().isBlank()) {
            reservation.setId(FileHandler.generateNextId(FILE));
            FileHandler.appendLine(FILE, reservation.toFileLine());
        } else {
            FileHandler.updateLine(FILE, reservation.getId(), reservation.toFileLine());
        }
        return reservation;
    }

    public List<Reservation> findAll() {
        List<Reservation> list = new ArrayList<>();
        for (String line : FileHandler.readLines(FILE)) {
            list.add(Reservation.fromFileLine(line));
        }
        return list;
    }

    public Optional<Reservation> findById(String id) {
        String line = FileHandler.findById(FILE, id);
        return line != null ? Optional.of(Reservation.fromFileLine(line)) : Optional.empty();
    }

    public List<Reservation> findByUserId(String userId) {
        List<Reservation> result = new ArrayList<>();
        for (Reservation r : findAll()) {
            if (userId.equals(r.getUserId())) result.add(r);
        }
        return result;
    }

    public List<Reservation> findByTableId(String tableId) {
        List<Reservation> result = new ArrayList<>();
        for (Reservation r : findAll()) {
            if (tableId.equals(r.getTableId())) result.add(r);
        }
        return result;
    }

    /**
     * ABSTRACTION — checks if a table is already booked at a specific date+time.
     * Called by ReservationService.isTableAvailable().
     */
    public boolean existsActiveReservation(String tableId, String date, String time) {
        for (Reservation r : findAll()) {
            if (tableId.equals(r.getTableId())
                    && date.equals(r.getDate())
                    && time.equals(r.getTime())
                    && !"CANCELLED".equals(r.getStatus())) {
                return true;
            }
        }
        return false;
    }

    public boolean existsActiveReservationExcluding(String tableId, String date,
                                                    String time, String excludeId) {
        for (Reservation r : findAll()) {
            if (tableId.equals(r.getTableId())
                    && date.equals(r.getDate())
                    && time.equals(r.getTime())
                    && !"CANCELLED".equals(r.getStatus())
                    && !excludeId.equals(r.getId())) {
                return true;
            }
        }
        return false;
    }

    public List<Reservation> findByStatus(String status) {
        List<Reservation> result = new ArrayList<>();
        for (Reservation r : findAll()) {
            if (status.equalsIgnoreCase(r.getStatus())) result.add(r);
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
