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
    height: "30vh",
  },
}));

const Uploader = (): JSX.Element => {
  const { classes } = useStyles();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    let objectURL: string | null = null;

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

  const clearFile = (): void => {
    setFile(null);
    setPreview(null);
    resetRef.current?.();
  };

  return (
    <>
      <Container size="md">
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
