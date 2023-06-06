import React from "react";
import { Grid, ScrollArea } from "@mantine/core";
import { HeaderAction } from "./Header";
import Updates from "./Updates";
import Uploader from "./Uploader";
import Output from "./Output";
import Dashboard from "./Dashboard";

function Layout() {
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
          <Uploader />
        </Grid.Col>
        <Grid.Col span={3} style={{ borderLeft: "1px solid black" }}>
          <Output />
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
