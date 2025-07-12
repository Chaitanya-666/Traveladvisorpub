import Header from "./components/header/header.jsx";
import List from "./components/list/list.jsx";
import Map from "./components/map/Map.jsx";
import { CssBaseline, Grid } from "@mui/material";
import { getPlacesData, getWeatherData } from "./apis/index.js";
import { useEffect, useState, useRef } from "react";

export default function App() {
  const [places, setPlaces] = useState([]);
  const [Mapcoords, setMapcoords] = useState([0, 0]);
  const [MyMapcoords, setMyMapcoords] = useState([0, 0]);
  // use default bounds in case geo locator fails to fetch the current position 
  const [bounds, setBounds] = useState({
    ne: [19.2715, 73.0728], // Top-right corner: Thane region
    sw: [18.9058, 72.7759]  // Bottom-left corner: South Mumbai region
  });
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");
  const [childClicked, setChildClicked] = useState(null); // this will help get the exact thing clicked shown on the list by scrolling 
  const [isLoading, setIsLoading] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const requestCount = useRef(0); // Counter to keep track of API requests , to prevent overuse
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    const getGeolocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        setMapcoords([latitude, longitude]);
        setMyMapcoords([latitude, longitude]);

        // console.log(Mapcoords, bounds);
      } catch (error) {
        console.error("Error getting geolocation: ", error);
        // Optionally, set a fallback location here
        // setMapcoords([fallbackLatitude, fallbackLongitude]);
      }
    };
    // firstly defined entire function and now called it 
    getGeolocation();
  }, []);

  useEffect(() => {
    if (requestCount.current < 5 && bounds.ne && bounds.sw) {
      const timeoutId = setTimeout(() => {
        setIsLoading(true);
        getPlacesData(type, bounds.sw, bounds.ne)
          .then((data) => {
            if (data) {
              setPlaces(data);
              setFilteredPlaces([]);
              requestCount.current += 1;
            }
          })
          .catch((err) => console.error("Error fetching places:", err))
          .finally(() => setIsLoading(false));
      }, 1000); // Add delay between bound changes

      return () => clearTimeout(timeoutId);
    } else {
      console.log("Maximum API request limit reached.");
    }
    if (Mapcoords[0] != 0 && Mapcoords[1] != 0) {
      getWeatherData(Mapcoords[0], Mapcoords[1]).then(
        (data) => {
          setWeatherData(data);
          console.log("Weather data fetched successfully:", data);
        }
      ).catch(
        (err) => console.log("error occurred while fetching weather data", err)
      ).finally(() =>
        console.log("Weather data fetch attempt completed")
      );
    }
  }, [Mapcoords, bounds, type]);

  useEffect(() => {
    // whenever rating changes we need to filter places based on rating
    const tempFilteredPlaces = places?.filter((place) => place.rating > rating);
    console.log({ tempFilteredPlaces });
    if (rating && tempFilteredPlaces.length > 0) {
      setFilteredPlaces(tempFilteredPlaces);
    } else {
      setFilteredPlaces(places);// reset filtered places when rating is removed
      // because when we also select of option all rating == 0  possible hence this else is necessary 
    }
  }, [rating]);

  return (
    <>
      <CssBaseline />
      <Header Mapcoords={Mapcoords} setMapcoords={setMapcoords} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            filteredPlaces={filteredPlaces}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            childClicked={childClicked}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={8} style={{ height: "calc(100vh - 64px)" }}>
          <Map
            MyMapcoords={MyMapcoords}
            setMapcoords={setMapcoords}
            setBounds={setBounds}
            Mapcoords={Mapcoords}
            filteredPlaces={filteredPlaces}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
}