import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Sketch-Pad';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element = {<Home/>} />
        {/* <Route path="/Home"  element = {<DrawingPage/>} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;