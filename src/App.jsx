import React from "react";
import Uploader from "./Components/Uploader";
import Nav from "./Components/Nav";
import { MantineProvider, AppShell } from "@mantine/core";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell padding="md">
        <Nav />
        <Uploader />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
