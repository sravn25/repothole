import React from "react";
import { Paper, Alert, Text } from "@mantine/core";
import { TbAlertCircle } from "react-icons/tb";

const Notification = ({ show, close, classData, scoreData }) => {
  return (
    <>
      <Paper style={{ height: "100px" }}>
        {show && (
          <Alert
            title="Pothole Detected Ahead"
            icon={<TbAlertCircle size="1rem" />}
            withCloseButton
            closeButtonLabel="Pothole alert"
            onClose={() => close()}
          >
            {classData}
            <br />
            {scoreData}
          </Alert>
        )}
      </Paper>
    </>
  );
};

export default Notification;

export const PotholeCounts = ({ count }) => {
  return (
    <>
      <Paper style={{ height: "100px" }}>
        <Alert
          title="Number of Potholes Reported at Current Location"
          icon={<TbAlertCircle size="1rem" />}
          color={count >= 1 ? "red" : "blue"}
        >
          <Text size="lg" underline span>
            {count}
          </Text>{" "}
          reported {count > 0 ? "potholes" : "pothole"} nearby
        </Alert>
      </Paper>
    </>
  );
};
