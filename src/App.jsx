

import './App.css';
import ElectricRaysBackground from './components/ElectricRaysBackground';
import CssBaseline from '@mui/material/CssBaseline';
import CustomAppBar from './components/CustomAppBar';
import HeroSection from './components/HeroSection';

import FeatureSection from './components/FeatureSection';
import SolucionesSolaresCompletas from './components/SolucionesSolaresCompletas';


function App() {
  return (
    <div>
      <ElectricRaysBackground />
      <CssBaseline />
      <CustomAppBar />
      <HeroSection />
      <SolucionesSolaresCompletas />
      <FeatureSection />
    </div>
  );
}

export default App
