import React from "react";
import { Paper, Alert } from "@mantine/core";
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
