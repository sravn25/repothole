import React, { useState, useEffect, useRef } from "react";
import { load, identify, getOutput } from "../Modules/Tensorflow";
import {
  createStyles,
  Center,
  Container,
  Button,
  Group,
  Paper,
  Text,
  FileButton,
  Image,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    // height: "30vh",
  },
}));


const Uploader = (props) => {
  const { classes } = useStyles();

  const [file, setFile] = useState(null); // selected image file
  const [preview, setPreview] = useState(null); // preview selected image file

  const [loaded, setLoaded] = useState(false); // loaded ML model

  const resetRef = useRef(null);
  const imageRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");

  // sets preview when file is uploaded
  useEffect(() => {
    let objectURL = null;
    if (file) {
      objectURL = URL.createObjectURL(file);
      setPreview(objectURL);
      runPrediction(objectURL);
    }
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [file]);

  // load ML model only once
  useEffect(() => {
    try {
      load().then(() => {
        setLoaded(true);
        console.log(loaded);
      });
    } catch {
      console.log("error loading model");
    }
  }, [loaded]);

  // removes selected image and its preview
  const clearFile = () => {
    console.log("clearFile start");
    console.log(file);
    console.log(preview);
    console.log(resetRef);
    setFile(null);
    setPreview(null);
    props.sendOutput("");
    resetRef.current?.();
    console.log("clearFile end");
  };

  // predict function
  const runPrediction = async (objectURL) => {
    if (!loaded) return;
    else {
      props.sendOutput("");
      await identify(objectURL); // run prediction in Tensorflow.js
      props.sendOutput(getOutput()); // send output to Main.jsx
    }
  };

  // fetch latitute & longtitude
  const successCallback = (position) => {
    setLocation(position);

    // convert latitute & longtitude to human readable address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLocationAddress(data.display_name);
      })
      .catch((error) => {
        console.log("Error fetching location address:", error);
      });
  };
  // location function - error call back
  const errorCallback = (error) => {
    console.log(error);
  };
  //location function - make location more accurate
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
  };

  //get current position
  useEffect(() => {
    if (navigator.geolocation) {
      //call Geolocation API by calling navigator.geolocation
      navigator.geolocation.getCurrentPosition(
        //Returns the current location of the device
        successCallback,
        errorCallback,
        options,
        (error) => {
          console.log("Error retrieving location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported in this browser");
    }
  }, []);

  return (

    /* (remove when done)

        1. Disable Upload button if location not shared (done)
        2. Disable Upload button if model not loadaed (is disabled, but button should be grey colour) (done)
        3. If pothole, upload to Firebase

    */

    <>
      <Container size="lg">
        <Paper
          shadow="xs"
          radius="md"
          p="xl"
          m="xl"
          withBorder
          className={classes.wrapper}
        >
          <Center>
            <Image
              maw={500}
              fit="contain"
              mx="auto"
              // radius="md"
              alt="not found"
              src={preview}
              withPlaceholder
              width={200}
              height={200}
              ref={imageRef}
            />
          </Center>
        </Paper>
      </Container>

      <Group position="center">
        <FileButton
          onChange={setFile}
          accept="image/png, image/jpeg"
          disabled={!loaded}
        >
          {(props) => <Button {...props} disabled={!locationAddress} >Upload Image</Button>}
        </FileButton>
        <Button disabled={!file} color="red" onClick={clearFile}>
          Remove
        </Button>
      </Group>
      {file && (
        <Text size="sm" align="center" mt="sm">
          Picked file: {file.name}
        </Text>
      )}

      {location /* display location (remove this after testing) */ ? (
        <Text>Location: {locationAddress}</Text>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </>
  );
};

export default Uploader;
