import { Paper, Typography, useMediaQuery, Menu, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Rating from '@mui/material/Rating';
// use media query to make our app more responsive , paper is basically div with some styling
import { StyledPaper, MapContainer, MarkerContainer, Pointer } from './styles';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './mapStyles.css';
import L from 'leaflet'; //  This is needed for custom icons
//L is the global Leaflet object that gives access to Leaflet's core classes and methods. you're importing Leaflet’s full object and assigning it to L, just like how Leaflet works in plain JS (L.map(), L.marker(), L.icon(), etc.).

// custom colored marker for other marked entities 
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIcon1 = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const weatherCodeToIcon = {
  0: '01d', // Clear sky
  1: '02d', // Mainly clear
  2: '03d', // Partly cloudy
  3: '04d', // Overcast
  45: '50d', // Fog
  48: '50d', // Depositing rime fog
  51: '09d', // Drizzle: Light
  53: '09d',
  55: '09d',
  61: '10d', // Rain: Slight
  63: '10d',
  65: '10d',
  80: '09d', // Rain showers
  95: '11d', // Thunderstorm
};


const MapComponent = ({ MyMapcoords, Mapcoords, setMapcoords, setBounds, filteredPlaces, setChildClicked, weatherData }) => {
  // state object of map 
  const defCoordinates = Mapcoords;
  // above should be an array of 2 elem
  const isMobile = useMediaQuery('(max-width:600px)');
  const [mapState, setMapState] = useState({
    center: defCoordinates,
    minZoom: 18,
    maxZoom: 20,
    zoom: 19,
    bounds: {
      ne: [19.2715, 73.0728], // Top-right corner: Thane region
      sw: [18.9058, 72.7759]  // Bottom-left corner: South Mumbai region
    },
    markerCoord: defCoordinates,
  });
  const [weatherMarkercoord, setWeatherMarkercoord] = useState([]);
  const UpdateMapView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, map.getZoom()); // Update the map's center dynamically
      }
    }, [center, map]);
    return null;
  };
  useEffect(() => {
    if (Mapcoords && Mapcoords[0] !== 0 && Mapcoords[1] !== 0) {
      setMapState((prev) => ({
        ...prev,
        center: Mapcoords,
        markerCoord: Mapcoords,
      }));
      // console.log("Mapcoords provided:", Mapcoords);
      // default align weathercoord to this if other things arent present yet 
      setWeatherMarkercoord([Mapcoords[0], Mapcoords[1]]);
    }
  }, [Mapcoords]);

  // Custom Hook for map events
  const MapEvents = () => {
    useMapEvents({
      moveend: (event) => {
        const map = event.target;
        const newCenter = map.getCenter();
        const newBounds = map.getBounds();
        const northEast = newBounds.getNorthEast();
        const southWest = newBounds.getSouthWest();

        // Get the visible bounds of the map
        const visibleBounds = map.getBounds();
        const paddingFactor = 1; // 100% padding

        // Calculate padded bounds
        const latPadding = (visibleBounds.getNorth() - visibleBounds.getSouth()) * paddingFactor;
        const lngPadding = (visibleBounds.getEast() - visibleBounds.getWest()) * paddingFactor;

        setMapState((prev) => ({
          ...prev,
          center: newCenter,
          zoom: map.getZoom(),
          bounds: visibleBounds,
        }));

        setMapcoords([newCenter.lat, newCenter.lng]);

        // Set bounds with slight padding to ensure we get all places in view
        setBounds({
          ne: [
            visibleBounds.getNorth() + latPadding,
            visibleBounds.getEast() + lngPadding
          ],
          sw: [
            visibleBounds.getSouth() - latPadding,
            visibleBounds.getWest() - lngPadding
          ],
        });
        // console.log("Your location and the visible bounds , Visible map bounds:", {
        //   your_lat: MyMapcoords[0],
        //   your_long: MyMapcoords[1],
        //   north: visibleBounds.getNorth(),
        //   south: visibleBounds.getSouth(),
        //   east: visibleBounds.getEast(),
        //   west: visibleBounds.getWest(),
        // });
      },
      zoomend: (event) => {
        const map = event.target; // Access map instance
        setMapState((prev) => ({
          ...prev,
          zoom: map.getZoom(),
        }));
      },
      click: (event) => {
        // because getting every cities coordinates and then fetching weather on that basis the api openweathermap by rapidapi wasnt functioning hence a workaround is to let there be a weathermarker the user will simply touch on map to view the weather details of that lat and long hence mapclick event just modifies that weather marker 
        setWeatherMarkercoord([event.latlng.lat, event.latlng.lng]);
      },
    });
    return null;
  };

  // if the screen is larger than 600px then its false else true
  // min-width will be true upto x pixels inclusive and max-width will be true beyond x pixels inclusive 


  return (
    <MapContainer>
      <LeafletMap
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: '100%', width: '100%' }}
        minZoom={5} // Set minimum zoom level
        maxZoom={18} // Set maximum zoom level      
      >
        <UpdateMapView center={mapState.center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* removed the .filter(place =>
          'latitude' in place && // Check if the 'latitude' key exists
          'longitude' in place && // Check if the 'longitude' key exists
          typeof place.latitude === 'number' && // Ensure 'latitude' is a number
          typeof place.longitude === 'number' // Ensure 'longitude' is a number
        )
        for some reason it is causing the markers not to be displayed ?? 
        want to stylise other markers as red 
        */}
        {/*  
          For api usage concerns set the displaying on markers of map so that only elite spots would be displayed with help of markers
        */}
        {filteredPlaces?.filter((place, originalIndex) => {
          // Store the original index on the place object if it passes the filter
          if (Number(place.rating) >= 4.0) {
            place._originalIndex = originalIndex;
            // mutate the place to hold one temporary property called as originalIndex so that later child clicked isnt undefined 
            return true;
          }
          return false;
        })
          .slice(0, 10)
          .map((place) => (
            <Marker
              key={place.name}
              position={[Number(place.latitude), Number(place.longitude)]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  setChildClicked(place._originalIndex);
                  //console.log("Original index of clicked place:", place._originalIndex);
                },
              }}
            >
              <Popup closeButton={false}>
                {isMobile ? (
                  <Box sx={{
                    display: 'flex',
                    gap: 1,
                    padding: 1,
                    alignItems: 'center',
                    width: '60vw', // 60% of viewport width
                    maxWidth: '200px',
                    minWidth: '150px'
                  }}>
                    <LocationOnOutlinedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" noWrap>{place.name}</Typography>
                    <Rating
                      name="read-only"
                      value={Number(place.rating)}
                      readOnly
                      size="small"
                    />
                  </Box>
                ) : (
                  <StyledPaper elevation={3}>
                    <Typography variant="h3">{place.name}</Typography>
                    <img
                      src={place.photo?.images?.large?.url || 'https://demofree.sirv.com/nope-not-here.jpg'}
                      alt={place.name || 'Default Image'}
                      style={{ cursor: 'pointer' }}
                    />
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%',
                      justifyContent: 'center'
                    }}>
                      <Rating
                        name="read-only"
                        value={Number(place.rating)}
                        readOnly
                        size="medium"
                      />
                      <Typography variant="body2">
                        ({place.rating})
                      </Typography>
                    </Box>
                  </StyledPaper>
                )}
              </Popup>
            </Marker>
          ))}



        {mapState.markerCoord && (
          <Marker position={MyMapcoords} icon={customIcon1}>
            <Popup>

              <Typography variant="h6" color="primary">YOU ARE HERE!</Typography>
            </Popup>
          </Marker>
        )}
        {weatherData?.current_weather && weatherMarkercoord && (
          <Marker position={weatherMarkercoord}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={`http://openweathermap.org/img/w/${weatherCodeToIcon[weatherData.current_weather.weathercode] || '01d'
                    }.png`}
                  alt="Weather icon"
                  height="50"
                />
                <div>{weatherData.current_weather.temperature}°C</div>
                <div>{weatherData.current_weather.windspeed} km/h wind</div>
                <div>Touch map to view weather there!</div>
              </div>
            </Popup>
          </Marker>
        )}

        <MapEvents />
      </LeafletMap>
    </MapContainer>
  );
};

export default MapComponent;
