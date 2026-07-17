import axios from "axios";

const API = "http://localhost:8080/api/bookings";

const BookingService = {

    getMyBookings(userId) {
        return axios.get(`${API}/user/${userId}`);
    },

    cancelBooking(id) {
        return axios.delete(`${API}/${id}`);
    }

};

export default BookingService;