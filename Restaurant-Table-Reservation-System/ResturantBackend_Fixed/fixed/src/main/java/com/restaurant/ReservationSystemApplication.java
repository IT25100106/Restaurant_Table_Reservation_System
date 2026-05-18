package com.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReservationSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservationSystemApplication.class, args);
        System.out.println("========================================");
        System.out.println("  Restaurant Reservation System STARTED");
        System.out.println("  http://localhost:8080/api");
        System.out.println("========================================");
    }
}
