import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./Pages/Board";
import Layout from "./Components/LayoutComponents/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
