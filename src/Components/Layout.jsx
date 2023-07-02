import React, { useState, useEffect } from "react";
import { Grid, Paper, ScrollArea } from "@mantine/core";
import { HeaderAction } from "./Header";
import Updates from "./Updates";
import Notification, { PotholeCounts } from "./Notification";
import Uploader from "./Uploader";
import Output from "./Output";
import Dashboard from "./Dashboard";
import MapDisplay from "./MapDisplay";
import Decimal from "decimal.js";
import alertSound from "../sounds/alertsound.mp3";

import { storage, database } from "../Modules/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, set, push } from "firebase/database";
import { v4 } from "uuid";

function Layout() {
  const [outputClass, setOutputClass] = useState("");
  const [outputScore, setOutputScore] = useState("");
  const [showAlert, setShowAlert] = useState(true);
  const [predicting, setPredicting] = useState(true);
  const [skeleton, setSkeleton] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const sound = new Audio(alertSound);

  const playAlertSound = () => {
    sound.play();
  };

  const [center, setCenter] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });
  const [date, setDate] = useState("");
  const [file, setFile] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [reportCount, setReportCount] = useState(0);

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
      }, 500);
    }
  };

  // runs when score is updated
  useEffect(() => {
    console.log("updated outputScore", outputClass);
    // !outputClass ? setPredicting(true) : setPredicting(false); // runs the loading effect at output
    if (outputClass === "potholes") {
      setShowAlert(true);
      playAlertSound();
    } else {
      setShowAlert(false);
    }
    outputClass === "potholes" ? setShowMap(true) : setShowMap(false);
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

  // get file from Uploader.jsx
  const retrieveFile = (file) => {
    console.log(`received date: ${file}`);
    setFile(file);
  };

  // get date from Uploader.jsx
  const retrieveDate = (date) => {
    console.log(`received date: ${date}`);
    setDate(date);
  };

  // get pothole report count from Uploader.jsx
  const retrieveReportCount = (count) => {
    console.log(`received report count: ${count}`);
    setReportCount(count);
  };

  // save data to firebase
  useEffect(() => {
    if (file) {
      if (outputClass === "potholes") {
        // only save pothole's data to firebase
        setRepairStatus("Submitted to JKR for review");
        // set attributes that need to be saved to firebase
        const records = [
          {
            file: file, // image
            location: center.address, // fetched location address
            reportDate: date, // fetched date and time
            confidenceLevel: outputScore, // accuracy rate
            repairStatus: "Under Review", // default status
            readStatus: "false", // read status (false = unread; true = read)
          },
        ];
        // create save record function
        // output = alert ('data saved successfully')
        const uploadAndSavedRecord = async (record) => {
          try {
            const { file, ...data } = record;
            const imageRef = ref(storage, `images/${file.name}_${v4()}`); //set image file name
            await uploadBytes(imageRef, file); // upload image to firebase storage
            const url = await getDownloadURL(imageRef); // convert image into downloadURL, since firebase realtime database cant directly save image
            const newRecordRef = push(databaseRef(database, "pothole"));
            await set(newRecordRef, {
              Url: url,
              ...data,
            }); // push data to firebase realtime database
            alert("Submitted to JKR for review");
          } catch (error) {
            console.error("Error uploading image:", error);
            // Handle the error appropriately
          }
        };
        // call uploadAndSaveRecord function for each record
        records.forEach(uploadAndSavedRecord);
      } else if (outputClass === "plain") {
        setDate("N/A");
        setRepairStatus("N/A");
      }
    }
  }, [file, outputClass, outputScore]);

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
          <Paper withBorder>
            <Notification
              show={showAlert}
              close={closeAlert}
              classData={outputClass}
              scoreData={outputScore}
            />
            <Uploader
              sendOutput={handleOutput}
              sendLocation={retrieveLocation}
              sendDate={retrieveDate}
              sendFile={retrieveFile}
              sendReportCount={retrieveReportCount}
            />
            <PotholeCounts count={reportCount} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Output
            classData={"Class : " + outputClass}
            scoreData={outputScore}
            location={center.address}
            reportDate={date}
            repairStatus={repairStatus}
            updateOutputData={updateOutputComponent}
            loading={predicting}
            loader={skeleton}
          />
          <MapDisplay showMap={showMap} location={center} date={date} />
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
