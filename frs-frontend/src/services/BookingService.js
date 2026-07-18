import axios from "axios";

const API = "http://localhost:8080/api/bookings";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

const BookingService = {

  getMyBookings(userId) {
    return axios.get(`${API}/user/${userId}`, getAuthHeaders());
  },

  cancelBooking(id) {
    return axios.delete(`${API}/${id}`, getAuthHeaders());
  }

};

export default BookingService;