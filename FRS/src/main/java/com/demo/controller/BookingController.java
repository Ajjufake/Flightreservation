package com.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.entity.Booking;
import com.demo.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ===========================
    // Book Flight
    // ===========================

    @PostMapping("/book")
    public Booking bookFlight(
            @RequestParam Long userId,
            @RequestParam Long flightId,
            @RequestBody Booking booking) {

        return bookingService.bookFlight(userId, flightId, booking);
    }

    // ===========================
    // Get All Bookings
    // ===========================

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // ===========================
    // Get Bookings By User
    // ===========================

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(
            @PathVariable Long userId) {

        return bookingService.getBookingsByUser(userId);
    }

    // ===========================
    // Get Bookings By Flight
    // ===========================

    @GetMapping("/flight/{flightId}")
    public List<Booking> getBookingsByFlight(
            @PathVariable Long flightId) {

        return bookingService.getBookingsByFlight(flightId);
    }

    // ===========================
    // Get Booked Seats
    // ===========================

    @GetMapping("/seats/{flightId}")
    public List<String> getBookedSeats(
            @PathVariable Long flightId) {

        return bookingService.getBookedSeats(flightId);
    }

    // ===========================
    // Cancel Booking
    // ===========================

    @DeleteMapping("/{bookingId}")
    public String cancelBooking(
            @PathVariable Long bookingId) {

        return bookingService.cancelBooking(bookingId);
    }

}