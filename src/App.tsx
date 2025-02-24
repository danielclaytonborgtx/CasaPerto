import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/home';
import MapScreen from './pages/MapScreen/mapScreen';
import ListScreen from './pages/ListScreen/listScreen';
import Layout from './layout/layout'; 
import SignIn from './pages/SignIn/signIn';
import SignUp from './pages/SignUp/signUp';
import AddProperty from './pages/AddProperty/addProperty';
import EditProperty from './pages/EditProperty/editProperty';
import Contact from './pages/Contact/contact';
import PropertyDetails from './pages/PropertyDetails/propertyDetails';
import Profile from './pages/Profile/profile';
import Brokers from './pages/Brokers/brokers';
import Messages from './pages/Messages/messages';
import Settings from './pages/Settings/settings';
import Team from './pages/Team/team';
import Profiles from './pages/Profiles/profiles';
import CreateTeam from './pages/CreateTeam/createTeam';
import EditTeam from './pages/Edit-team/edit-team';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import GlobalStyles from './styles';
import GoogleMapsApiLoader from './components/GoogleMapsApiLoader';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles /> 
      <Router>
        <GoogleMapsApiLoader> 
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="signIn" element={<SignIn />} />
              <Route path="signUp" element={<SignUp />} />
              <Route path="map" element={<MapScreen />} />
              <Route path="addProperty" element={<AddProperty />} />
              <Route path="editProperty/:id" element={<EditProperty />} />
              <Route path="list" element={<ListScreen />} />
              <Route path="contact" element={<Contact />} />
              <Route path="property/:id" element={<PropertyDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="brokers" element={<Brokers />} />
              <Route path="messages" element={<Messages />} />
              <Route path="/messages/:brokerId" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="team" element={<Team />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="/edit-team/:id" element={<EditTeam />} />
              <Route path="/profiles/:userId" element={<Profiles />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </GoogleMapsApiLoader> 
      </Router>
    </>
  );
};

export default App;
