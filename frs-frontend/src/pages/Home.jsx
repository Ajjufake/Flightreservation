import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import Footer from "../components/Footer";
import dubaiImage from "../assets/cities/dubai.jpg";
import tokyoImage from "../assets/cities/tokyo.jpg";
import newYorkImage from "../assets/cities/newyork.jpg";

function Home() {

    return (

        <>

        <div className="container">

            <Hero/>

            <SearchBar/>

            <div className="mt-5">

                <h2 className="text-center">

                    Explore Top Destinations

                </h2>

                <div className="row mt-4">

                    <DestinationCard
                        title="Dubai"
                        price="17000"
                        image={dubaiImage}
                    />

                    <DestinationCard
                        title="Tokyo"
                        price="30000"
                        image={tokyoImage}
                    />

                    <DestinationCard
                        title="New York"
                        price="54000"
                        image={newYorkImage}
                    />

                </div>

            </div>

        </div>

        <Footer/>

        </>

    );

}

export default Home;