// https://docs.mapbox.com/api/maps/static-images/
// https://docs.mapbox.com/api/search/geocoding/
// https://docs.mapbox.com/playground/geocoding/?search_text=block%20c%2C%20taylo&country=my&proximity=ip
import React from "react";
import { Paper, Image } from "@mantine/core";
/*
    props:
            1. showMap : boolean
            2. location : latitude: null,
                          longitude: null,
                          address: "",
                          map latitue 3.0637357 map longitude 101.6271656
*/
const MapDisplay = (props) => {
  console.log("map latitue", props.location.latitude);
  console.log("map longitude", props.location.longitude);
  console.log("map address", props.location.address);

  const MAPBOX_API_KEY =
    "pk.eyJ1Ijoic3Jhdm4yNCIsImEiOiJjbGlsZnhwN3IwM3M3M2V0aHpucjFjNHRtIn0.tYZYaZY46O5Bb_6hzreo0w";

  //"https://api.mapbox.com/styles/v1/{username}/{style_id}/static/{overlay}/{lon},{lat},{zoom},{bearing},{pitch}|{bbox}|{auto}/{width}x{height}{@2x}"
  const mapTemplate = (longitude, latitude, zoom) => {
    return `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s+555555(${longitude},${latitude})/${longitude},${latitude},${zoom},0,0/300x200?access_token=${MAPBOX_API_KEY}`;
  };

  return (
    <>
      {props.showMap ? (
        <Image
          src={mapTemplate(
            props.location.longitude,
            props.location.latitude,
            15
          )}
          alt="static map"
          height={200}
          width={250}
        ></Image>
      ) : (
        <Paper>nothing</Paper>
      )}
      {/*mapTemplate(props.location.longitude, props.location.latitude, 15)*/}
    </>
  );
};

export default MapDisplay;
