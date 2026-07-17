function AdminFlights() {
  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      <button className="btn btn-success mb-3">
        Add Flight
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Flight No</th>
            <th>Airline</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>AI101</td>
            <td>Air India</td>
            <td>Hyderabad</td>
            <td>Delhi</td>
            <td>
              <button className="btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminFlights;