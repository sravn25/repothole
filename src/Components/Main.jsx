import React from "react";
import Uploader from "./Uploader";
import Output from "./Output";
import { Stack } from "@mantine/core";


const Main = () => {
  return (
    <>
      <Stack h={"80vh"} justify="space-between">
        <Uploader />
        <Output />
      </Stack>
    </>
  );
};

export default Main;
