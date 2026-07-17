package com.demo.dto;

public class DashboardResponse {

    private long totalBookings;
    private long upcomingBookings;
    private long cancelledBookings;
    private double totalSpent;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalBookings,
                             long upcomingBookings,
                             long cancelledBookings,
                             double totalSpent) {

        this.totalBookings = totalBookings;
        this.upcomingBookings = upcomingBookings;
        this.cancelledBookings = cancelledBookings;
        this.totalSpent = totalSpent;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getUpcomingBookings() {
        return upcomingBookings;
    }

    public void setUpcomingBookings(long upcomingBookings) {
        this.upcomingBookings = upcomingBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(double totalSpent) {
        this.totalSpent = totalSpent;
    }

}