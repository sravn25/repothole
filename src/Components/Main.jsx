import React from "react";
import Uploader from "./Uploader";
import Output from "./Output";
import Dashboard from "./Dashboard";
import { Stack } from "@mantine/core";


const Main = () => {

  let output = "";

  const handleOutput = (data) => {
    console.log(`received data: ${data}`);
  }

  return (
    <>
      <Stack h={"80vh"} justify="space-between">
        <Uploader sendOutput={handleOutput} />
        <Output />
      </Stack>
      <Dashboard />
    </>
  );
};

export default Main;
