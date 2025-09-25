import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
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
            { nombre: 'Panel 580W', imagen: '/paneles/sunevo580.jpg', precio: '240' },
            { nombre: 'Panel 590W', imagen: '/paneles/panel-jinko-solar-590w.jpg', precio: '250' },
        ],
    },
    {
        nombre: 'Inversores',
        imagen: 'https://www.svgrepo.com/show/235546/renewable-energy-power.svg',
        candidatos: [
            { nombre: 'Inversor 3.6kW', imagen: '/inversores/inversor3.6kW.jpg', precio: '700' },
            { nombre: 'Inversor 4kW', imagen: '/inversores/sumry4kw.jpg', precio: '720' },
            { nombre: 'Inversor 5kW', imagen: '/inversores/ECO-WORTHY5kw.jpg', precio: '1550' },
            { nombre: 'PowMr Alta Frecuencia 10kW', imagen: '/inversores/powmr10kw.jpg', precio: '2100' },
            { nombre: 'PowMr Baja Frecuencia 10kW', imagen: '/inversores/powmr10kw.jpg', precio: '2500' },
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
    const [cantidadPaneles, setCantidadPaneles] = useState(1);

    // Calcular suma total de precios seleccionados
    const total = MODULOS.reduce((acc, modulo, idx) => {
        const candidatoSeleccionado = selecciones[idx];
        if (!candidatoSeleccionado) return acc;
        const candidatoObj = modulo.candidatos.find(c => c.nombre === candidatoSeleccionado);
        if (!candidatoObj) return acc;
        let precio = parseFloat(candidatoObj.precio) || 0;
        // Para paneles solares, multiplicar por cantidad
        if (idx === 0) precio *= cantidadPaneles;
        return acc + precio;
    }, 0);

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
                                    {/* Input de cantidad solo para paneles solares */}
                                    {idx === 0 && (
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 1, mb: 1 }}>
                                            <TextField
                                                label="Cantidad"
                                                type="number"
                                                size="small"
                                                inputProps={{ min: 1 }}
                                                value={cantidadPaneles}
                                                onClick={e => e.stopPropagation()}
                                                onChange={e => setCantidadPaneles(Math.max(1, parseInt(e.target.value) || 1))}
                                                sx={{
                                                    width: 90,
                                                    mr: 1,
                                                    '& .MuiInputBase-input': { color: '#E59CFF', fontWeight: 700 },
                                                    '& .MuiInputLabel-root': { color: '#E59CFF' },
                                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#E59CFF' },
                                                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#BA9CFF' },
                                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#9CB2FF' },
                                                    '& label.Mui-focused': { color: '#9CB2FF' },
                                                }}
                                            />
                                            <IconButton
                                                aria-label="sumar"
                                                onClick={e => { e.stopPropagation(); setCantidadPaneles(cantidadPaneles + 1); }}
                                                sx={{
                                                    bgcolor: '#E59CFF',
                                                    color: '#fff',
                                                    '&:hover': { bgcolor: '#BA9CFF' },
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    ml: 1,
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                    {precioMostrar && (
                                        <Typography sx={{ color: '#ff0000', fontSize: 18, fontWeight: 800, textAlign: 'center' }}>
                                            {idx === 0 && cantidadPaneles > 1
                                                ? `$${(parseFloat(precioMostrar) * cantidadPaneles).toLocaleString()}`
                                                : `$${precioMostrar}`}
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );
                })}
            </Box>
            <Typography variant="h5" sx={{ mt: 4, color: '#ffe066', fontWeight: 800, textAlign: 'center' }}>
                Total: ${total.toLocaleString()}
            </Typography>
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
    );
}
