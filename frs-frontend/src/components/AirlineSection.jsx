import airIndia from "../assets/airlines/air india.jpg";
import indigo from "../assets/airlines/indigo.jpg";

function AirlineSection() {
  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Popular Airlines
      </h2>

      <div className="row">

        <div className="col-md-6">

          <div className="card shadow-lg border-0 rounded-4 text-center p-4">

            <img
              src={airIndia}
              alt="Air India"
              style={{
                height: "180px",
                objectFit: "contain"
              }}
            />

            <h4 className="mt-3">
              Air India
            </h4>

          </div>

        </div>

        <div className="col-md-6">

          <div className="card shadow-lg border-0 rounded-4 text-center p-4">

            <img
              src={indigo}
              alt="IndiGo"
              style={{
                height: "180px",
                objectFit: "contain"
              }}
            />

            <h4 className="mt-3">
              IndiGo
            </h4>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AirlineSection;