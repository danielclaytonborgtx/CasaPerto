import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles";
import MapScreen from "./pages/MapScreen/mapScreen";

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<MapScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
