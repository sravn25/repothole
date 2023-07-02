import React, { useState, useEffect } from "react";
import { Navbar, Text, Stack, Paper, ScrollArea, Tooltip } from "@mantine/core";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { orderBy } from "lodash";

const Updates = () => {
  const [potholeUpdates, setPotholeUpdates] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  // tooltip function
  // input data = attribute fetched from firebase
  // output data = confidential level, report date and repair status
  const renderTooltipContent = (item) => (
    <div>
      <Text>confidence Level: {item.confidenceLevel}</Text>
      <Text>Report Date: {item.reportDate}</Text>
      <Text>Repair Status: {item.repairStatus}</Text>
    </div>
  );

  // fetch data from firebase, sorted to display the latest 15 records
  useEffect(() => {
    const database = getDatabase();
    const potholeRef = ref(database, "pothole");

    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const fetchedData = snapshot.val();
        const sortedData = orderBy(fetchedData, "reportDate", "desc"); // Sort the data by 'reportDate' in descending order
        setPotholeUpdates(Object.values(sortedData).slice(0, 15)); // Fetch the latest 15 records
      }
    };

    onValue(potholeRef, onDataChange);

    return () => {
      off(potholeRef, onDataChange);
    };
  }, []);

  return (
    /* (remove when done)

        1. Limit the pothole updates at 15 updates (use map) (done, refer to line 30)

    */

    <Navbar>
      <Navbar.Section grow mt="md" component={ScrollArea}>
        <Text
          fz={{ md: "md", lg: "lg", base: "xs" }}
          fw={700}
          pl={"xs"}
          pb={"xs"}
        >
          Live Updates
        </Text>
        <Stack justify="flex-start" spacing={{ base: "xs" }}>
          {potholeUpdates.map((item, index) => (
            <Tooltip
              key={index}
              placement="bottom"
              label={renderTooltipContent(item)}
            >
              <Paper
                shadow="xs"
                p="xl"
                withBorder
                key={index}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Text>id: {index + 1}</Text>
                <Text>location: {item.location}</Text>
              </Paper>
            </Tooltip>
          ))}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Updates;
