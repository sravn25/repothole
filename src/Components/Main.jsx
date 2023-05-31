import React, { useState } from "react";
import Uploader from "./Uploader";
import Output from "./Output";
import { Stack, Alert, Paper } from "@mantine/core";
import { TbAlertCircle } from "react-icons/tb";
import Decimal from "decimal.js";

const Main = () => {
  const [outputClass, setOutputClass] = useState("");
  const [outputScore, setOutputScore] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  // updates output text in Output.jsx
  const updateOutputComponent = (newData) => {
    const dataArr = newData.split(" "); // turn ML output to array [class, score]
    console.log("dataArr: ", dataArr);
    console.log("dataArr[0]: ", dataArr[0]);
    console.log("dataArr[1]: ", new Decimal(dataArr[1] * 100).toPrecision(4));
    setOutputClass(dataArr[0]);
    console.log("outputClass: ", outputClass);
    setOutputScore(String(new Decimal(dataArr[1] * 100).toPrecision(4)));
    console.log("outputScore: ", outputScore);
  };

  // receives output text from Tensorflow.js and runs the function above
  // output format: `${class} ${score}`
  const handleOutput = (data) => {
    console.log(`received data: ${data}`);
    if (data === undefined) return; // if no data
    else updateOutputComponent(data);
  };
 
  /*
  to complete 
  */
  // clean output
  const removeOutput = () => {
    updateOutputComponent("");
  };

  /*
  to complete
  */
  // alert user
  const handleShowAlert = () => {
    setShowAlert(true);
  };

  return (
    <>
      <Stack h={"80vh"} justify="space-between">
        <Paper style={{ height: "100px" }}>
          {showAlert && (
            <Alert
              title="Pothole Detected Ahead"
              icon={<TbAlertCircle size="1rem" />}
              withCloseButton
              closeButtonLabel="Pothole alert"
              onClose={() => setShowAlert(false)}
            >
              {outputClass}
              <br />
              {outputScore}
              Test
            </Alert>
          )}
        </Paper>
        <Uploader sendOutput={handleOutput} />
        <Output
          classData={outputClass}
          scoreData={outputScore}
          updateOutputData={updateOutputComponent}
        />
      </Stack>
    </>
  );
};

export default Main;
