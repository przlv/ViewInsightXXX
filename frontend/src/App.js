import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from "./components/Header/Header"
import Graphs from "./pages/Graphs/Graphs"
import DataView from "./pages/DataView/DataView"
import Settings from "./pages/Settings/Settings"
import AddChart from "./pages/Add/Chart/AddChart"
import AddDataset from "./pages/Add/dataset/Dataset";
import CreateChart from "./pages/CreateCharts/CreateForm";

function App() {
  return (
    <div className="App">
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<DataView />} />
                <Route path="/graphs" element={<Graphs />} />
                <Route path="/dataview" element={<DataView />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/graphs/add/chart" element={<AddChart />} />
                <Route path="/add/chart" element={<AddChart />} />
                <Route path="/dataview/add/dataset" element={<AddDataset />} />
                <Route path="/create/chart/" element={<CreateChart />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
