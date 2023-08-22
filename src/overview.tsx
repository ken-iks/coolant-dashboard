// Overview.tsx
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat';
import { useMemo } from "react";
import { auth } from './firebaseConfig';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { PassThrough } from 'stream';
import { Loader } from "@googlemaps/js-api-loader"
import './overview.css';
import useGetUser from './getuser';




const Overview: React.FC = () => {
  const nam = useGetUser();
  const name = nam.charAt(0).toUpperCase() + nam.slice(1);

  // Project location. Need to automate
  const myLatLong = { lat: 0.65129, lng: 111.53028 };

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
          + ', the beautiful rollings hills of Indonesia Borneo, Merakai.');
          infowindow.open(map, marker);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }  

  function loadMap() {
    const loader = new Loader({
      apiKey: 'AIzaSyBD1laELKvYHTLFnaugKqNuYHD93MikLF0',
      version: 'weekly',
    });
    // Loading map as: map
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 0.65119, lng: 111.53015 },
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
      fetch('https://gist.githubusercontent.com/kennybop/d1716a6ccd16cf464f001a0cdd3532d6/raw/561fda40328b5a660c3faea2b58df583aee2f0a0/btg.geojson')
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


