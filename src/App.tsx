import React from "react";
import Uploader from "./Components/Uploader";
import { MantineProvider } from "@mantine/core";
// import logo from './logo.svg';
// import "./App.css";

function App() {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Uploader />
    </MantineProvider>
  );
}

export default App;
