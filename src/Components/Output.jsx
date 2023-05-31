import React, { useState } from "react";
import { createStyles, Paper, Text } from "@mantine/core";
import Decimal from "decimal.js";

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

  output format: `${class} ${score}`

	Can update accordingly at Tensorflow.js (line 101-102)
	
	*if made an object, remember to use object notation, ie. {props.data.class}
	*if made an array, remember to use array notation, ie. {props.data[i]}
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
        <Text>Output</Text>
        <Text>{props.classData}</Text>
        <Text>{props.scoreData}</Text>
      </Paper>
    </>
  );
};

export default Output;
