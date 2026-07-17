package com.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.entity.Flight;
import com.demo.service.FlightService;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Add Flight
    @PostMapping
    public Flight saveFlight(@RequestBody Flight flight) {
        return flightService.saveFlight(flight);
    }

    // Get All Flights
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    // Get Flight By ID
    @GetMapping("/id/{id}")
    public Flight getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    // Search Flights
    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String departureDate) {

        return flightService.searchFlights(
                source,
                destination,
                LocalDate.parse(departureDate));
    }

    // Update Flight
    @PutMapping("/{id}")
    public Flight updateFlight(@PathVariable Long id,
                               @RequestBody Flight flight) {
        return flightService.updateFlight(id, flight);
    }

    // Delete Flight
    @DeleteMapping("/{id}")
    public String deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return "Flight Deleted Successfully";
    }
    @GetMapping("/route")
    public List<Flight> searchByRoute(
            @RequestParam String source,
            @RequestParam String destination) {

        return flightService.searchByRoute(source, destination);
    }
}