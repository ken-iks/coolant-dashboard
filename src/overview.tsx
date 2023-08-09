// Overview.tsx
import React from 'react';
import { useMemo } from "react";
import { auth } from './firebaseConfig';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { PassThrough } from 'stream';
import { Loader } from "@googlemaps/js-api-loader"
import './overview.css';

const user = auth.currentUser;
const name = user?.email?.split('@')[0];

const Overview: React.FC = () => {

  // This will change based on who's project it is
  const myLatLong = { lat: 0.6509, lng: 111.53073 };

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
          map.setZoom(14);
          infowindow.setContent('This project is located at: ' + response.results[0].formatted_address
          + '. Set in the beautiful rollings hills of Indonesia Borneo, Merakai is an idyllic portion of '
          + 'rainforest that has faced increasing pressures from palm oil, rubber plantains, and selective local timber harvesting. '+
          'The indigenous Dayak peoples have lived in the region of Merakai since an estimated 15th Century. '+
          'They are your stewards of the rainforest and experts in all matters of restoration.');
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

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 0.65119, lng: 111.53015 },
        zoom: 6,
        mapTypeId: 'hybrid',
      });
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

    });


    return (
      <div>
      <h1> Hey {name}! Here are your project locations. Click on a project for more information </h1>
      <div id="map" className='map'></div>
    </div>
    );
  }

  return loadMap();
}

export default Overview;


