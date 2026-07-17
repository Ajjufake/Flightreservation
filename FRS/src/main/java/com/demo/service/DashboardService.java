package com.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.dto.DashboardResponse;
import com.demo.entity.Booking;
import com.demo.repository.BookingRepository;

@Service
public class DashboardService {

    @Autowired
    private BookingRepository bookingRepository;

    public DashboardResponse getDashboard(Long userId) {

        long totalBookings = bookingRepository.countByUserId(userId);

        long cancelledBookings =
                bookingRepository.countByUserIdAndStatus(
                        userId,
                        "CANCELLED");

        long upcomingBookings =
                totalBookings - cancelledBookings;

        List<Booking> bookings =
                bookingRepository.findByUserId(userId);

        double totalSpent = 0;

        for (Booking booking : bookings) {

            if (booking.getFlight() != null) {

                totalSpent += booking.getFlight().getPrice();

            }

        }

        return new DashboardResponse(
                totalBookings,
                upcomingBookings,
                cancelledBookings,
                totalSpent);

    }

}