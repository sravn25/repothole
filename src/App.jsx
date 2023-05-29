import React from "react";
import firebase from "./Modules/Firebase";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Nav from "./Components/Nav";
import Main from "./Components/Main";
import Dashboard from "./Components/Dashboard";
import { AppShell } from "@mantine/core";

function App() {
  return (
    <Router>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppShell padding="md">
          <Nav />
          <Switch>
            <Route path="/admin">
              <Dashboard />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </AppShell>
      </MantineProvider>
    </Router>
  );
}

export default App;
