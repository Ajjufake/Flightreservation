package com.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.Booking;
import com.demo.entity.Flight;
import com.demo.entity.User;
import com.demo.repository.BookingRepository;
import com.demo.repository.FlightRepository;
import com.demo.repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    // ===========================
    // Book Flight
    // ===========================

    public Booking bookFlight(Long userId, Long flightId, Booking booking) {

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find Flight
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        // Check seat availability
        if (flight.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        // Check duplicate seat
        if (bookingRepository.existsByFlightIdAndSeatNumber(
                flightId,
                booking.getSeatNumber())) {

            throw new RuntimeException(
                    "Seat " + booking.getSeatNumber() + " is already booked");
        }

        // Reduce seat count
        flight.setAvailableSeats(flight.getAvailableSeats() - 1);
        flightRepository.save(flight);

        // Booking Details
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingId(UUID.randomUUID().toString().substring(0, 8));
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    // ===========================
    // Get All Bookings
    // ===========================

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ===========================
    // Get Bookings By User
    // ===========================

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // ===========================
    // Get Bookings By Flight
    // ===========================

    public List<Booking> getBookingsByFlight(Long flightId) {
        return bookingRepository.findByFlightId(flightId);
    }

    // ===========================
    // Get Booked Seats
    // ===========================

    public List<String> getBookedSeats(Long flightId) {

        return bookingRepository
                .findByFlightId(flightId)
                .stream()
                .map(Booking::getSeatNumber)
                .toList();
    }

    // ===========================
    // Cancel Booking
    // ===========================

    public String cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        Flight flight = booking.getFlight();

        // Restore Seat Count
        flight.setAvailableSeats(flight.getAvailableSeats() + 1);
        flightRepository.save(flight);

        bookingRepository.delete(booking);

        return "Booking Cancelled Successfully";
    }

}