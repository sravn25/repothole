import React, { useState, useEffect } from "react";
import Uploader from "./Uploader";
import Output from "./Output";
import { Stack, Alert, Paper } from "@mantine/core";
import { TbAlertCircle } from "react-icons/tb";
import Decimal from "decimal.js";

const Main = () => {
  const [outputClass, setOutputClass] = useState("");
  const [outputScore, setOutputScore] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [predicting, setPredicting] = useState(true);
  const [skeleton, setSkeleton] = useState(true);

  // updates output text in Output.jsx
  const updateOutputComponent = (newData) => {
    if (newData === "") {
      setOutputClass("");
      setOutputScore("");
      setPredicting(true);
      setSkeleton(false);
      return;
    } else {
      setSkeleton(true);
      setPredicting(true);
      const dataArr = newData.split(" "); // turn ML output to array [class, score]
      const pClass = dataArr[0];
      const pScore = String(new Decimal(dataArr[1] * 100).toPrecision(4));
      setTimeout(() => {
        setOutputClass(pClass);
        setOutputScore(pScore);
        setSkeleton(false);
        setPredicting(false);
      }, 2500);
    }
  };

  // runs when score is updated
  useEffect(() => {
    console.log("updated outputScore", outputClass);
    //!outputClass ? setPredicting(true) : setPredicting(false); // runs the loading effect at output
    outputClass === "potholes" ? setShowAlert(true) : setShowAlert(false); // shows alert (might need to write a better logic)
  }, [outputClass]);

  // receives output text from Tensorflow.js and runs the function above
  // output format: `${class} ${score}`
  const handleOutput = (data) => {
    console.log(`received data: ${data}`);
    if (data === undefined) return; // if no data
    else updateOutputComponent(data);
  };

  return (
    <>
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
          </Alert>
        )}
      </Paper>
      <Stack h={"80vh"} justify="space-between">
        <Uploader sendOutput={handleOutput} />
        <Output
          classData={outputClass}
          scoreData={outputScore}
          updateOutputData={updateOutputComponent}
          loading={predicting}
          loader={skeleton}
        />
      </Stack>
    </>
  );
};

export default Main;