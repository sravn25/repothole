import React, { useState, useEffect, useRef } from "react";
import { load, identify, getOutput } from "../Modules/Tensorflow";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { TbAlertCircle } from "react-icons/tb";
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
  Box,
  Alert,
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

  const [data, setData] = useState({});
  const [potholeCount, setPotholeCount] = useState(0); // to store unread report

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
      props.sendOutput(getOutput()); // send output to Layout.jsx
      props.sendLocation(
        [location.coords.latitude, location.coords.longitude],
        locationAddress
      );
      const currentDate = new Date(); //get date and time form user local laptop
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const currentDateTimeString = currentDate.toLocaleString(
        "zh-CN",
        options
      ); //set display format of date and time
      props.sendDate(currentDateTimeString);
      props.sendFile(file);
    }
  };

  // fetch latitute & longtitude
  const successCallback = (position) => {
    setLocation(position);
    console.log("Position:\n");
    console.log("Latitude:", position.coords.latitude);
    console.log("Longitude:", position.coords.longitude);

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

  //get current position & display total pothole reported at user's location
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


      // fetch data from firebase
      const database = getDatabase();
      const potholeRef = ref(database, "pothole");

      const onDataChange = (snapshot) => {
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          setData({ ...fetchedData });

          // Calculate the number of potholes based on location
          const count = Object.values(fetchedData).filter(
            (item) => item.location === locationAddress
          ).length;
          setPotholeCount(count); // set number of pothole
        } else {
          setData({});
          setPotholeCount(0);
        }
      };

      onValue(potholeRef, onDataChange);

      return () => {
        setData({});
      };

    } else {
      console.log("Geolocation is not supported in this browser");
    }
  }, []);








  return (
    /* (remove when done)

        1. If pothole, upload to Firebase

    */

    <>
      <Container size="lg">

        {/* display total pothole at user's current location */}
        {potholeCount >= 1 && (
          <Paper style={{ height: "100px" }}>
            <Alert
              title="Notification"
              icon={<TbAlertCircle size="1rem" />}
              withCloseButton
              closeButtonLabel="Notification alert"
            >
              {potholeCount} potholes in your location.{" "}
            </Alert>
          </Paper>
        )}

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
          {(props) => (
            <Button {...props} disabled={!locationAddress}>
              Upload Image
            </Button>
          )}
        </FileButton>
        <Button disabled={!file} color="red" onClick={clearFile}>
          Remove
        </Button>
      </Group>

      {/*
        {file && (
          <Text size="sm" align="center" mt="sm">
            Picked file: {file.name}
          </Text>
        )}
      */}

      <Box p="xl" m="xl" sx={(theme) => ({})}>
        {location /* display location (remove this after testing) */ ? (
          <Text>Location: {locationAddress}</Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </Box>
    </>
  );
};

export default Uploader;