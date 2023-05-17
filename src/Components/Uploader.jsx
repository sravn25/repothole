import React, { useState, useEffect, useRef } from "react";
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

const Uploader = () => {
  const { classes } = useStyles();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const resetRef = useRef(null);

  useEffect(() => {
    let objectURL = null;

    if (file) {
      objectURL = URL.createObjectURL(file);
      setPreview(objectURL);
    }
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL); 
      }
    };
  }, [file]);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    resetRef.current?.();
  };

  return (
    <>
      <Container size="lg">
        <Paper shadow="xs" radius="md" p="xl" m="xl" withBorder className={classes.wrapper}>
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
            />
          </Center>
        </Paper>
      </Container>

      <Group position="center">
        <FileButton onChange={setFile} accept="image/png, image/jpeg">
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
