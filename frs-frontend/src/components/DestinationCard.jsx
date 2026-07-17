import { useNavigate } from "react-router-dom";

function DestinationCard({ image, title, price }) {

    const navigate = useNavigate();

    const handleClick = () => {

        navigate(
            `/flights?source=Hyderabad&destination=${encodeURIComponent(title)}`
        );

    };

    return (

        <div className="col-lg-4 col-md-6 mb-4">

            <div
                className="card shadow border-0 h-100 destination-card"
                onClick={handleClick}
                style={{
                    cursor: "pointer",
                    borderRadius: "20px",
                    overflow: "hidden"
                }}
            >

                <img
                    src={image}
                    alt={title}
                    style={{
                        height: "280px",
                        width: "100%",
                        objectFit: "cover"
                    }}
                />

                <div className="card-body">

                    <h3>{title}</h3>

                    <h5 className="text-primary">

                        From ₹{price}

                    </h5>

                </div>

            </div>

        </div>

    );

}

export default DestinationCard;