import React, { useState } from 'react';
import GuardarDisenoSolar from './GuardarDisenoSolar';
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
import { PROTECCIONES_OPCIONES } from '../data/protecciones';
import { MODULOS } from '../data/modulos';


export default function DisenadorFotovoltaico() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
    const [selecciones, setSelecciones] = useState({});
    const [cantidadPaneles, setCantidadPaneles] = useState(0);
    const [consumos, setConsumos] = useState([]);
    const [consumoSeleccionado, setConsumoSeleccionado] = useState(null);
    // Protecciones y aditamentos
    const [protecciones, setProtecciones] = useState([]);
    const [proteccionMenuAnchor, setProteccionMenuAnchor] = useState(null);
    const [proteccionSeleccionada, setProteccionSeleccionada] = useState(null);
    const [cantidadProteccion, setCantidadProteccion] = useState(1);
    const [metrosCableProteccion, setMetrosCableProteccion] = useState(1);
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);

    // Cargar productos con stock
    useEffect(() => {
        async function fetchProductos() {
            const { data } = await supabase.from('productos').select('*');
            setProductos(data || []);
            setLoadingProductos(false);
        }
        fetchProductos();
    }, []);

    // Cargar consumos guardados
    useEffect(() => {
        async function fetchConsumos() {
            const { data } = await supabase.from('consumos').select('*');
            setConsumos(data || []);
        }
        fetchConsumos();
    }, []);

    // Calcular suma total de precios seleccionados
    let totalModulos = MODULOS.reduce((acc, modulo, idx) => {
        const candidatoSeleccionado = selecciones[idx];
        if (!candidatoSeleccionado) return acc;
        const candidatoObj = modulo.candidatos.find(c => c.nombre === candidatoSeleccionado);
        if (!candidatoObj) return acc;
        let precio = parseFloat(candidatoObj.precio) || 0;
        // Para paneles solares, multiplicar por cantidad
        if (idx === 0) precio *= cantidadPaneles;
        return acc + precio;
    }, 0);

    // Sumar protecciones y cable solar (de la lista de protecciones)
    let totalProtecciones = protecciones.reduce((acc, p) => {
        // Si es cable solar, sumar precio * metros
        if (p.nombre === 'Cable solar m') {
            return acc + (parseFloat(p.precio) * (parseInt(p.metros) || 0));
        } else {
            return acc + (parseFloat(p.precio) * (parseInt(p.cantidad) || 0));
        }
    }, 0);

    const total = totalModulos + totalProtecciones;

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
        <Box>
            <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', minHeight: '80vh' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                    Diseña tu sistema fotovoltaico
                </Typography>
                {/* Selector de cálculo de consumo guardado */}
                <Box sx={{ mb: 3, width: '100%', maxWidth: 400 }}>
                    <Typography variant="subtitle1" sx={{ color: '#ffe066', fontWeight: 600, mb: 1 }}>
                        Selecciona un cálculo de consumo guardado:
                    </Typography>
                    <select
                        value={consumoSeleccionado ? consumoSeleccionado.id : ''}
                        onChange={e => {
                            const found = consumos.find(c => String(c.id) === e.target.value);
                            setConsumoSeleccionado(found || null);
                        }}
                        style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 6 }}
                    >
                        <option value="">-- Selecciona un cálculo --</option>
                        {consumos.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre_cliente} ({c.consumo_total} Wh/día)
                            </option>
                        ))}
                    </select>
                    {consumoSeleccionado && (
                        <Box sx={{ mt: 2, bgcolor: '#23234a', borderRadius: 2, p: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#E59CFF', fontWeight: 700 }}>
                                Consumo total: {consumoSeleccionado.consumo_total} Wh/día
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ffe066', fontWeight: 600, mb: 1 }}>
                                Detalles:
                            </Typography>
                            {Array.isArray(consumoSeleccionado.detalles_consumo) && consumoSeleccionado.detalles_consumo.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                    {consumoSeleccionado.detalles_consumo.map((item, idx) => (
                                        <li key={idx} style={{ color: '#fff', marginBottom: 2 }}>
                                            <b>{item.appliance}</b>: {item.power}W × {item.hours}h × {item.quantity} = <b>{item.total} Wh/día</b>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#fff8' }}>No hay detalles.</Typography>
                            )}
                            {/* Mostrar suma total de Wh del cálculo */}
                            <Typography variant="body2" sx={{ color: '#ffe066', fontWeight: 700, mt: 1 }}>
                                Total Wh/h: {Array.isArray(consumoSeleccionado.detalles_consumo)
                                    ? consumoSeleccionado.detalles_consumo.reduce((acc, item) => acc + (item.perHour || 0), 0)
                                    : 0}
                            </Typography>
                        </Box>
                    )}
                </Box>
                {/* Sección de protecciones y aditamentos */}
                <Box sx={{ width: '100%', maxWidth: 500, mb: 4, bgcolor: '#181828', borderRadius: 3, p: 3, boxShadow: 2 }}>
                    <Typography variant="h6" sx={{ color: '#ffe066', fontWeight: 700, mb: 2 }}>
                        Protecciones y aditamentos
                    </Typography>
                    {/* Lista de protecciones añadidas */}
                    {protecciones.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            {protecciones.map((p, i) => {
                                const prod = productos.find(prod => prod.nombre === p.nombre);
                                return (
                                    <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1, bgcolor: '#23234a', borderRadius: 2, p: 1 }}>
                                        <Typography sx={{ color: '#E59CFF', fontWeight: 600 }}>{p.nombre}</Typography>
                                        <Typography sx={{ color: '#fff', fontSize: 13 }}>({p.tipo})</Typography>
                                        <Typography sx={{ color: '#ffe066', fontSize: 13 }}>x{p.cantidad}</Typography>
                                        <Typography sx={{ color: '#fff', fontSize: 13 }}>Precio: ${p.precio * p.cantidad}</Typography>
                                        <Typography sx={{ color: '#4caf50', fontSize: 13 }}>Stock: {prod?.stock ?? 0}</Typography>
                                        <IconButton size="small" onClick={() => setProtecciones(protecciones.filter((_, j) => j !== i))}>
                                            <span style={{ color: '#ff6666', fontWeight: 700 }}>✕</span>
                                        </IconButton>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                    {/* Botón para añadir protección/aditamento */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton size="small" sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }}
                            onClick={e => setProteccionMenuAnchor(e.currentTarget)}>
                            <AddIcon />
                        </IconButton>
                        <Typography variant="body2" sx={{ color: '#E59CFF' }}>Añadir protección/aditamento</Typography>
                    </Box>
                    <Menu anchorEl={proteccionMenuAnchor} open={Boolean(proteccionMenuAnchor)} onClose={() => { setProteccionMenuAnchor(null); setProteccionSeleccionada(null); setCantidadProteccion(1); setMetrosCableProteccion(1); }}>
                        {PROTECCIONES_OPCIONES.filter(op => {
                            const prod = productos.find(p => p.nombre === op.nombre && (p.stock ?? 0) > 0);
                            return !!prod;
                        }).map(op => {
                            const prod = productos.find(p => p.nombre === op.nombre && (p.stock ?? 0) > 0);
                            return (
                                <MenuItem key={op.nombre} onClick={() => {
                                    setProteccionSeleccionada(op);
                                    setProteccionMenuAnchor(null);
                                }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600 }}>{op.nombre}</span>
                                        <span style={{ fontSize: 12, color: '#888' }}>{op.tipo} - ${op.precio}</span>
                                        <span style={{ fontSize: 12, color: '#4caf50' }}>Stock: {prod?.stock ?? 0}</span>
                                    </Box>
                                </MenuItem>
                            );
                        })}
                    </Menu>
                    {/* Si hay una protección seleccionada, mostrar input de cantidad o metros y botón de confirmar */}
                    {proteccionSeleccionada && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography sx={{ color: '#E59CFF', fontWeight: 600 }}>{proteccionSeleccionada.nombre}</Typography>
                            {proteccionSeleccionada.nombre === 'Cable solar m' ? (
                                <TextField
                                    label="Metros"
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 1 }}
                                    value={metrosCableProteccion}
                                    onChange={e => setMetrosCableProteccion(Math.max(1, parseInt(e.target.value) || 1))}
                                    sx={{ width: 80 }}
                                />
                            ) : (
                                <TextField
                                    label="Cantidad"
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 1 }}
                                    value={cantidadProteccion}
                                    onChange={e => setCantidadProteccion(Math.max(1, parseInt(e.target.value) || 1))}
                                    sx={{ width: 80 }}
                                />
                            )}
                            <IconButton size="small" sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }}
                                onClick={() => {
                                    if (proteccionSeleccionada.nombre === 'Cable solar m') {
                                        setProtecciones([
                                            ...protecciones,
                                            { ...proteccionSeleccionada, cantidad: metrosCableProteccion, metros: metrosCableProteccion }
                                        ]);
                                        setMetrosCableProteccion(1);
                                    } else {
                                        setProtecciones([
                                            ...protecciones,
                                            { ...proteccionSeleccionada, cantidad: cantidadProteccion }
                                        ]);
                                        setCantidadProteccion(1);
                                    }
                                    setProteccionSeleccionada(null);
                                }}>
                                <AddIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => {
                                setProteccionSeleccionada(null);
                                setCantidadProteccion(1);
                                setMetrosCableProteccion(1);
                            }}>
                                <span style={{ color: '#ff6666', fontWeight: 700 }}>✕</span>
                            </IconButton>
                        </Box>
                    )}

                </Box>
                {/* ...resto del diseñador... */}
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
            {/* GuardarDisenoSolar permite guardar el diseño solar y asociarlo a un cliente */}
            <GuardarDisenoSolar diseno={{
                ...selecciones,
                cantidadPaneles,
                protecciones,
                totalModulos,
                totalProtecciones
            }} total={total} />
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
