import React from "react";
import firebase from "./Modules/Firebase";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout, { DashboardLayout } from "./Components/Layout";

function App() {
  return (
    <Router>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: "dark" }}
      >
        <Switch>
          <Route path="/admin">
            <DashboardLayout />
          </Route>
          <Route path="/">
            <Layout />
          </Route>
        </Switch>
      </MantineProvider>
    </Router>
  );
}

export default App;
