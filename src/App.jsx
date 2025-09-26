

import './App.css';
import ElectricRaysBackground from './components/ElectricRaysBackground';
import CssBaseline from '@mui/material/CssBaseline';
import CustomAppBar from './components/CustomAppBar';
import HeroSection from './components/HeroSection';


import FeatureSection from './components/FeatureSection';
import SolucionesSolaresCompletas from './components/SolucionesSolaresCompletas';
import { Routes, Route } from 'react-router-dom';
import TrabajosHechos from './pages/TrabajosHechos';
import TiendaPage from './pages/TiendaPage';
import AdminProductos from './pages/AdminProductos';
<Route path="/admin-productos" element={<AdminProductos />} />
import DisenadorFotovoltaico from './components/DisenadorFotovoltaico';

function App() {
  return (
    <>
      <ElectricRaysBackground />
      <CssBaseline />
      <CustomAppBar />
      <Routes>
        <Route path="/" element={<>
          <HeroSection />
          <SolucionesSolaresCompletas />
          <FeatureSection />
        </>} />
        <Route path="/disenador" element={<DisenadorFotovoltaico />} />
        <Route path="/trabajos-hechos" element={<TrabajosHechos />} />
        <Route path="/tienda" element={<TiendaPage />} />
        <Route path="/admin-productos" element={<AdminProductos />} />
      </Routes>
    </>
  );
}

export default App;
