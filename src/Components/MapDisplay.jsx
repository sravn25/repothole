import React from "react";
import { createStyles, Paper, Image } from "@mantine/core";
/*
    props:
            1. showMap : boolean
            2. location : latitude: null,
                          longitude: null,
                          address: "",
                          map latitue 3.0637357 map longitude 101.6271656
*/

const useStyles = createStyles((theme) => ({
  terminalBox: {
    border: "1px solid black",
    height: "300px",
  },
}));

const MapDisplay = (props) => {
  const { classes } = useStyles();
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
      <Paper shadow="xs" className={classes.terminalBox} mt={"xs"} pl={"xs"}>
        {props.showMap ? (
          <Image
            src={mapTemplate(
              props.location.longitude,
              props.location.latitude,
              15
            )}
            alt="static map"
            height={300}
            width={300}
            p={"xs"}
          ></Image>
        ) : (
          <Paper p={"xs"}>No Pothole Detected</Paper>
        )}
      </Paper>
    </>
  );
};

export default MapDisplay;
