import React from "react";
import { createStyles, Paper, Stack, Text } from "@mantine/core";
import { SkeletonLoader } from "./Loader";

const useStyles = createStyles((theme) => ({
  terminalBox: {
    border: "1px solid black",
    height: "300px",
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
      <Paper shadow="xs" className={classes.terminalBox} pl={"xs"} withBorder>
        <Text
          fz={{ md: "md", lg: "lg", base: "xs" }}
          fw={700}
          pl={"xs"}
          pb={"xs"}
        >
          Results
        </Text>
        <Paper pl="xl">
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
              <Stack spacing={"xs"}>
                <Text fw={700} tt={"capitalize"}>
                  {props.classData.slice()}
                </Text>
                <Text>Accuracy: {props.scoreData} %</Text>
                <Text>Location: {props.location}</Text>
                <Text>Report Date: {props.reportDate}</Text>
                <Text>Repair Status: {props.repairStatus}</Text>
              </Stack>
            </>
          )}
        </Paper>
      </Paper>
    </>
  );
};

export default Output;
