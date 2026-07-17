package com.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ===========================
    // User Bookings
    // ===========================

    List<Booking> findByUserId(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, String status);

    // ===========================
    // Flight Bookings
    // ===========================

    List<Booking> findByFlightId(Long flightId);

    // ===========================
    // Seat Checking
    // ===========================

    Optional<Booking> findByFlightIdAndSeatNumber(
            Long flightId,
            String seatNumber);

    boolean existsByFlightIdAndSeatNumber(
            Long flightId,
            String seatNumber);

}