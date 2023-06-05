import React, { useState } from "react";
import { createStyles, Paper, Text } from "@mantine/core";
// import Decimal from "decimal.js";
import { SkeletonLoader } from "./Loader";

const useStyles = createStyles((theme) => ({
  terminalBox: {
    border: "1px solid black",
    height: "20vh",
  },
}));

/*
 expected output:

      pothole {
        result: potholes detected
        confidential level: 99.9%
        location: xxx
        reported date: 5/6/2023 10:31pm
        repair status: submitted to JKR for review
      }

      plain {
        result: no potholes detected
        confidential level: 99.9%
        location: xxx
      }

*/

// terminal based output for machine learning
const Output = (props) => {
  const { classes } = useStyles();

  return (
    /* (remove when done)

        1. Create a template for output display 
        2. Loading animation when predicting
        3. Add a map that shows the location of the pothole

    */

    <>
      <Paper shadow="xs" className={classes.terminalBox} pl={"xs"}>
        <Text>Result</Text>
        {props.loading ? (
          <div>
            <Text>Please upload an image to start detection.</Text>
          </div>
        ) : (
          <div>
            <Text>{props.classData}</Text>
            <Text>{props.scoreData}</Text>
          </div>
        )}
      </Paper>
    </>
  );
};

export default Output;
