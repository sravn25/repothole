import React, {useState} from "react";
import Uploader from "./Uploader";
import Output from "./Output";
import { Stack } from "@mantine/core";


const Main = () => {

  const [outputData, setOutputData] = useState('');

  // updates output text in Output.jsx
  const updateOutputComponent = (newData) => {
    setOutputData(newData);
  }

  // receives output text from Tensorflow.js and runs the function above
  const handleOutput = (data) => {
    console.log(`received data: ${data}`);
    updateOutputComponent(data);
  }

  return (
    <>
      <Stack h={"80vh"} justify="space-between">
        <Uploader sendOutput={handleOutput} />
        <Output data={outputData} updateOutputData={updateOutputComponent} />
      </Stack>
    </>
  );
};

export default Main;
