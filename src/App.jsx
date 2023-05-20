import React from "react";
import Nav from "./Components/Nav";
import Main from "./Components/Main";
import { MantineProvider, AppShell } from "@mantine/core";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell padding="md">
        <Nav />
        <Main />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
