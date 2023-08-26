// Overview.tsx
import React from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import './overview.css';
import useGetUser from './getuser';
import useGetModel from './getModel';



const Overview: React.FC = () => {

  // Getting name for personalized map intro
  const nam = useGetUser();
  // Capitalizing name
  const name = nam.charAt(0).toUpperCase() + nam.slice(1);

  // Getting project info from backend - this is the model for connecting backend
  // TODO: Utilize this model for the rest of the pages for which data is stored on the backend
  const project = useGetModel();
  if (!project) {
    console.log("Gathering project info")
    return (<div> Loading... </div>)
  }

  // Project location. Need to automate
  const myLatLong = { lat: project.lat, lng: project.long };

  // Function to generate marker for a given project location.
  function geocodeLatLng(
    geocoder: google.maps.Geocoder,
    map: google.maps.Map,
    marker: google.maps.Marker,
    infowindow: google.maps.InfoWindow
  ) {
    geocoder
      .geocode({ location: myLatLong })
      .then((response) => {
        if (response.results[0]) {
          map.setZoom(18);
          // Will need to automate content
          infowindow.setContent('This project is located at: ' + response.results[0].formatted_address
          + project.description);
          infowindow.open(map, marker);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }  

  function loadMap() {
    // TODO: Should find a way to hide this API Key for safety
    const loader = new Loader({
      apiKey: 'AIzaSyBD1laELKvYHTLFnaugKqNuYHD93MikLF0',
      version: 'weekly',
    });
    // Loading map as: map
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const map = new Map(document.getElementById("map") as HTMLElement, {
        center: myLatLong,
        zoom: 6,
        mapTypeId: 'hybrid',
      });
      // Setting color of project grid
      map.data.setStyle({
        fillColor: 'blue',     
        strokeWeight: 1,       
        strokeColor: 'red',    
        fillOpacity: 0.5       
      });  
      // Adding a marker to map. Should be able to add multiple markers to a map.
      const mapMarker = new google.maps.Marker({
        position: myLatLong,
        map,
        title: 'Location'
      });
      const geocoder = new google.maps.Geocoder();
      const infowindow = new google.maps.InfoWindow();
      mapMarker.addListener("click", () =>{
        geocodeLatLng(geocoder, map, mapMarker, infowindow);
      })
      // Fetch geojson from github gist
      fetch(project['gist-link'])
      .then(data => {
        // Parse the json in the response data
        const res = data.json();
        // Resolve the promise and add to map
        res.then(x => map.data.addGeoJson(x));
      })
      .catch(error => console.error('Error fetching GeoJSON:', error));
    });


    return (
      <div>
      <h1> Welcome, {name} </h1>
      <h3>Here are your project locations. Click on a project for more information</h3>
      <div id="map" className='map'></div>
    </div>
    );
  }

  return loadMap();
}

export default Overview;


