import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/home';
import MapScreen from './pages/MapScreen/mapScreen';
import ListScreen from './pages/ListScreen/listScreen';
import Layout from './layout/layout'; 
import SignIn from './pages/SignIn/signIn';
import SignUp from './pages/SignUp/signUp'
import AddProperty from './pages/AddProperty/addProperty';
import Contact from './pages/Contact/contact';
import PropertyDetails from './pages/PropertyDetails/propertyDetails';
import Profile from './pages/Profile/profile'
// import PropertyDetails from './pages/PropertyDetails'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import GlobalStyles from './styles';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles /> 
      <Router>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route path="signIn" element={<SignIn />} />
            <Route path="signUp" element={<SignUp />} />
            <Route index element={<Home />} />
            <Route path="map" element={<MapScreen />} />
            <Route path="list" element={<ListScreen />} />
            <Route path="addProperty" element={<AddProperty />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/property/:id" element={<PropertyDetails />} /> 
            <Route path="/profile" element={<Profile />} />
          </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
