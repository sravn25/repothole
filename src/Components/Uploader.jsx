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
    console.log(file);
    console.log(preview);
    console.log(resetRef);
    setFile(null);
    setPreview(null);
    resetRef.current?.();
  };

  // predict function
  const runPrediction = async (objectURL) => {
    if (!loaded) return;
    else {
      await identify(objectURL); // run prediction in Tensorflow.js
      props.sendOutput(getOutput()); // send output to Main.jsx

      /* (remove when done)

      1. need to set if predicted, no need to show loading animation
         when predicting, show loading animation

      2. remove output content if uploading / predicting new image

      */

    }
  };

  return (

    /* (remove when done)

        1. Add loading animation during prediction time
        2. Prompt user for location
        3. Disable Upload button if location not shared

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
          {(props) => <Button {...props}>Upload Image</Button>}
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
    </>
  );
};

export default Uploader;
