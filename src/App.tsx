import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/home';
import MapScreen from './pages/MapScreen/mapScreen';
import ListScreen from './pages/ListScreen/listScreen';
import Layout from './layout/layout'; 

import GlobalStyles from './styles';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles /> 
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="map" element={<MapScreen />} />
            <Route path="list" element={<ListScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
