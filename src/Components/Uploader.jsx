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

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loaded, setLoaded] = useState(false);
  const [predicted, setPredicted] = useState(false);

  const resetRef = useRef(null);
  // const fileInputRef = useRef(null);
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

  // const loadOnce = true;
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

  const clearFile = () => {
    console.log(file);
    console.log(preview);
    console.log(resetRef);
    setFile(null);
    setPreview(null);
    resetRef.current?.();
  };

  const runPrediction = async (objectURL) => {
    if (!loaded) return;
    else {
      await identify(objectURL)
      props.sendOutput(getOutput);
      // .then(() => {
        // setPredicted(true);
        // console.log(predicted);
        // console.log("?");
        // getOutput();
      // });
    }
  };

  return (
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
