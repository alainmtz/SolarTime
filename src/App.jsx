

import './App.css';
import ElectricRaysBackground from './components/ElectricRaysBackground';
import CssBaseline from '@mui/material/CssBaseline';
import CustomAppBar from './components/CustomAppBar';
import HeroSection from './components/HeroSection';


import FeatureSection from './components/FeatureSection';
import SolucionesSolaresCompletas from './components/SolucionesSolaresCompletas';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DisenadorFotovoltaico from './components/DisenadorFotovoltaico';

function App() {
  return (
    <Router>
      <ElectricRaysBackground />
      <CssBaseline />
      <CustomAppBar />
      <HeroSection />
      <Routes>
        <Route path="/" element={<>
          <SolucionesSolaresCompletas />
          <FeatureSection />
        </>} />
        <Route path="/disenador" element={<DisenadorFotovoltaico />} />
      </Routes>
    </Router>
  );
}

export default App;
