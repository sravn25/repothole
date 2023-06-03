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
  expected output
  Result: No Pothole Detected / Pothole Detected
  Confidence: 85%
*/

/* Output data looks like this  {

  output format: `${class} ${score}` (Tensorflow.js [line 101-102])

  }
*/

// terminal based output for machine learning
const Output = (props) => {
  const { classes } = useStyles();

  return (
    /* (remove when done)

        1. Alert user if pothole detected (top priority)

        2. Create a template for output display
        3. Clean output data whenever preview image is removed
        4. Loading animation when predicting

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
