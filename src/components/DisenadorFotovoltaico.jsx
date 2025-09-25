import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BatteryIcon from '@mui/icons-material/BatteryChargingFull';

const MODULOS = [
    {
        nombre: 'Paneles Solares',
        imagen: 'https://www.svgrepo.com/show/236459/solar-energy-solar-panel.svg',
        candidatos: [
            { nombre: 'Panel 450W', imagen: 'https://www.svgrepo.com/show/236459/solar-energy-solar-panel.svg', precio: '120' },
            { nombre: 'Panel 550W', imagen: 'https://cdn-icons-png.flaticon.com/512/2721/2721304.png', precio: '150' },
            { nombre: 'Panel 600W', imagen: 'https://cdn-icons-png.flaticon.com/512/2721/2721304.png', precio: '180' },
        ],
    },
    {
        nombre: 'Inversores',
        imagen: 'https://www.svgrepo.com/show/235546/renewable-energy-power.svg',
        candidatos: [
            { nombre: 'Inversor 3kW', imagen: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png', precio: '400' },
            { nombre: 'Inversor 5kW', imagen: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png', precio: '600' },
            { nombre: 'Inversor 10kW', imagen: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png', precio: '900' },
        ],
    },
    {
        nombre: 'Baterías',
        imagen: 'https://www.svgrepo.com/show/444310/gui-battery-charged.svg',
        candidatos: [
            { nombre: 'Batería DC-House 1280Wh', imagen: '/baterias/dchouse12V100A.jpg', voltage: '12V', Amperage: '100Ah', precio: '340' },
            { nombre: 'Batería dumfume 1280Wh', imagen: '/baterias/dumfume 12v-100A.jpg', voltage: '12V', Amperage: '100Ah', precio: '300' },
            { nombre: 'Batería MFUZOP 3840Wh', imagen: '/baterias/mfuzomp12v300A.jpg', voltage: '12V', Amperage: '300Ah', precio: '700' },
            { nombre: 'Batería DC-House 2560Wh', imagen: '/baterias/dc256.jpg', voltage: '24V', Amperage: '100Ah', precio: '700' },
            { nombre: 'Batería DC-House 5100Wh', imagen: '/baterias/dc51v.jpg', voltage: '51V', Amperage: '100Ah', precio: '1500' },
        ],
    },
];

export default function DisenadorFotovoltaico() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [selecciones, setSelecciones] = useState({});

    const handleClick = (event, moduloIdx) => {
        setAnchorEl(event.currentTarget);
        setModuloSeleccionado(moduloIdx);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setModuloSeleccionado(null);
    };

    const handleSelect = (candidato) => {
        setSelecciones({ ...selecciones, [moduloSeleccionado]: candidato });
        handleClose();
    };

    return (
        <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', minHeight: '80vh' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                Diseña tu sistema fotovoltaico
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {MODULOS.map((modulo, idx) => {
                    // Si hay selección, usar la imagen y el precio del candidato seleccionado
                    const candidatoSeleccionado = selecciones[idx];
                    const candidatoObj = candidatoSeleccionado
                        ? modulo.candidatos.find(c => c.nombre === candidatoSeleccionado)
                        : null;
                    const imagenMostrar = candidatoObj?.imagen || modulo.imagen;
                    const precioMostrar = candidatoObj?.precio;
                    return (
                        <Card key={modulo.nombre} sx={{ width: 220, boxShadow: 3, borderRadius: 4, bgcolor: '#000002', border: '1px solid #E59CFF' }}>
                            <CardActionArea onClick={(e) => handleClick(e, idx)}>
                                <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#111', borderRadius: 4 }}>
                                    <img src={imagenMostrar} alt={modulo.nombre} style={{ maxHeight: 100, maxWidth: '90%' }} />
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" sx={{ color: '#F4F0FF', fontWeight: 600, textAlign: 'center' }}>{modulo.nombre}</Typography>
                                    <Typography sx={{ color: '#E59CFF', fontSize: 14, textAlign: 'center', mt: 1 }}>
                                        {candidatoSeleccionado ? `Seleccionado: ${candidatoSeleccionado}` : 'Sin seleccionar'}
                                    </Typography>
                                    {precioMostrar && (
                                        <Typography sx={{ color: '#ff0000', fontSize: 18, fontWeight: 800, textAlign: 'center' }}>
                                            ${precioMostrar}
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );
                })}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    {moduloSeleccionado !== null && MODULOS[moduloSeleccionado].candidatos.map((candidato) => (
                        <MenuItem key={candidato.nombre} onClick={() => handleSelect(candidato.nombre)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img src={candidato.imagen} alt={candidato.nombre} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                                <span>{candidato.nombre}</span>
                            </Box>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Box>
    );
}
