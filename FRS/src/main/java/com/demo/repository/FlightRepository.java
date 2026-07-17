package com.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Search with date
    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDepartureDate(
            String source,
            String destination,
            LocalDate departureDate);

    // Search without date
    List<Flight> findBySourceIgnoreCaseAndDestinationIgnoreCase(
            String source,
            String destination);

}