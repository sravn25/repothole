import React from "react";
import { createStyles, Paper, Text } from "@mantine/core";
import { SkeletonLoader } from "./Loader";

const useStyles = createStyles((theme) => ({
  terminalBox: {
    border: "1px solid black",
    height: "20vh",
  },
}));

// terminal based output for machine learning
const Output = (props) => {
  const { classes } = useStyles();

  return (
    /* (remove when done)

        1. Loading animation when predicting ( needs fixing ) 

    */

    <>
      <Paper shadow="xs" className={classes.terminalBox} pl={"xs"}>
        <Text>Results</Text>
        {props.loading ? (
          <>
            {props.loader ? (
              <SkeletonLoader />
            ) : (
              <Text>Please upload an image to start detection.</Text>
            )}
          </>
        ) : (
          <>
            <Text>Class: {props.classData}</Text>
            <Text>Confidential Level: {props.scoreData}</Text>
            <Text>Location: {props.location}</Text>
            <Text>Report Date: {props.reportDate}</Text>
            <Text>Repair Status: {props.repairStatus}</Text>
          </>
        )}
      </Paper>
    </>
  );
};

export default Output;
