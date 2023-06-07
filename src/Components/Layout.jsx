import React, { useState, useEffect } from "react";
import { Grid, ScrollArea } from "@mantine/core";
import { HeaderAction } from "./Header";
import Updates from "./Updates";
import Notification from "./Notification";
import Uploader from "./Uploader";
import Output from "./Output";
import Dashboard from "./Dashboard";
import MapDisplay from "./MapDisplay";
import Decimal from "decimal.js";

function Layout() {
  const [outputClass, setOutputClass] = useState("");
  const [outputScore, setOutputScore] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [predicting, setPredicting] = useState(true);
  const [skeleton, setSkeleton] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const [center, setCenter] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });

  // updates output text in Output.jsx
  const updateOutputComponent = (newData) => {
    if (newData === "") {
      setOutputClass("");
      setOutputScore("");
      setShowMap(false);
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
        setShowMap(true);
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
    outputClass === "potholes" ? setShowMap(true) : setShowMap(false); //
  }, [outputClass]);

  // receives output text from Tensorflow.js and runs the function above
  // output format: `${class} ${score}`
  const handleOutput = (data) => {
    console.log(`received data: ${data}`);
    if (data === undefined) return; // if no data
    else updateOutputComponent(data);
  };

  // close alert
  const closeAlert = () => {
    setShowAlert(false);
  };

  // get coordinate and address from Uploader.jsx
  const retrieveLocation = (coordinate, address) => {
    console.log(`received coordinate: ${coordinate}`);
    console.log(`received address: ${address}`);
    setCenter({
      latitude: coordinate[0],
      longitude: coordinate[1],
      address: address,
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderAction />
      <Grid grow style={{ height: "100%", margin: 0 }}>
        <Grid.Col
          span={3}
          style={{ borderRight: "1px solid black", padding: 0 }}
        >
          <ScrollArea style={{ height: "100%" }}>
            <Updates />
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={6}>
          <Notification
            show={showAlert}
            close={closeAlert}
            classData={outputClass}
            scoreData={outputScore}
          />
          <Uploader sendOutput={handleOutput} sendLocation={retrieveLocation} />
        </Grid.Col>
        <Grid.Col span={3} style={{ borderLeft: "1px solid black" }}>
          <Output
            classData={outputClass}
            scoreData={outputScore}
            updateOutputData={updateOutputComponent}
            loading={predicting}
            loader={skeleton}
          />
          <MapDisplay showMap={showMap} location={center} />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeaderAction />
      <Dashboard />
    </div>
  );
}

export default Layout;
