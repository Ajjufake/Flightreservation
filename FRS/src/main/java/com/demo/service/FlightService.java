package com.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.Flight;
import com.demo.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // ==========================
    // Add Flight
    // ==========================
    public Flight saveFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    // ==========================
    // Get All Flights
    // ==========================
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // ==========================
    // Get Flight By ID
    // ==========================
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id).orElse(null);
    }

    // ==========================
    // Update Flight
    // ==========================
    public Flight updateFlight(Long id, Flight updatedFlight) {

        Flight flight = flightRepository.findById(id).orElse(null);

        if (flight != null) {

            flight.setFlightNumber(updatedFlight.getFlightNumber());
            flight.setAirline(updatedFlight.getAirline());
            flight.setSource(updatedFlight.getSource());
            flight.setDestination(updatedFlight.getDestination());
            flight.setDepartureDate(updatedFlight.getDepartureDate());
            flight.setDepartureTime(updatedFlight.getDepartureTime());
            flight.setArrivalTime(updatedFlight.getArrivalTime());
            flight.setPrice(updatedFlight.getPrice());
            flight.setAvailableSeats(updatedFlight.getAvailableSeats());

            return flightRepository.save(flight);
        }

        return null;
    }

    // ==========================
    // Search By Source + Destination + Date
    // ==========================
    public List<Flight> searchFlights(
            String source,
            String destination,
            LocalDate departureDate) {

        return flightRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureDate(
                        source,
                        destination,
                        departureDate);
    }

    // ==========================
    // Search By Route Only
    // ==========================
 // Search By Route
    public List<Flight> searchByRoute(String source, String destination) {

        return flightRepository.findBySourceIgnoreCaseAndDestinationIgnoreCase(
                source,
                destination
        );
    }
    // ==========================
    // Delete Flight
    // ==========================
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }
}