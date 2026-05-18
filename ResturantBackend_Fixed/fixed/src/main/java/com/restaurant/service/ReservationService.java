package com.restaurant.service;

import com.restaurant.model.Reservation;
import com.restaurant.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public Reservation createReservation(String userId, String userName, String tableId,
                                         int tableNumber, String date, String time,
                                         int partySize, String specialRequests) {
        if (reservationRepository.existsActiveReservation(tableId, date, time)) {
            throw new RuntimeException("Table is already reserved for " + date + " at " + time);
        }
        Reservation r = new Reservation(null, userId, userName, tableId, tableNumber,
                date, time, partySize, specialRequests);
        return reservationRepository.save(r);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));
    }

    public List<Reservation> getUserReservations(String userId) {
        return reservationRepository.findByUserId(userId);
    }

    public boolean isTableAvailable(String tableId, String date, String time) {
        return !reservationRepository.existsActiveReservation(tableId, date, time);
    }

    public Reservation updateReservation(String id, String date, String time,
                                         Integer partySize, String specialRequests) {
        Reservation r = getReservationById(id);
        if (!r.isActive()) throw new RuntimeException("Cannot update a " + r.getStatus() + " reservation");

        if (date != null && !date.isBlank()) r.setDate(date);
        if (time != null && !time.isBlank()) r.setTime(time);
        if (partySize != null) r.setPartySize(partySize);
        if (specialRequests != null) r.setSpecialRequests(specialRequests);

        return reservationRepository.save(r);
    }

    public Reservation confirmReservation(String id) {
        Reservation r = getReservationById(id);
        r.confirm();
        return reservationRepository.save(r);
    }

    public Reservation cancelReservation(String id) {
        Reservation r = getReservationById(id);
        r.cancel();
        return reservationRepository.save(r);
    }

    public Reservation completeReservation(String id) {
        Reservation r = getReservationById(id);
        r.complete();
        return reservationRepository.save(r);
    }

    public void deleteReservation(String id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found: " + id);
        }
        reservationRepository.deleteById(id);
    }
}
