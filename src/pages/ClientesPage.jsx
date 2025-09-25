import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [disenos, setDisenos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Obtener clientes (consumos)
            const { data: consumos, error: errorConsumos } = await supabase
                .from('consumos')
                .select('*');
            // Obtener disenos
            const { data: disenosData, error: errorDisenos } = await supabase
                .from('disenos_solares')
                .select('*');
            setClientes(consumos || []);
            setDisenos(disenosData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <Typography>Cargando...</Typography>;

    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                Clientes y Soluciones Solares
            </Typography>
            {clientes.length === 0 ? (
                <Typography>No hay clientes registrados.</Typography>
            ) : (
                clientes.map(cliente => (
                    <Paper key={cliente.id} sx={{ mb: 4, p: 3, bgcolor: '#181828', color: '#fff' }}>
                        <Typography variant="h6" sx={{ color: '#ffe066', fontWeight: 700 }}>
                            {cliente.nombre_cliente || 'Sin nombre'}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: '#E59CFF', mb: 1 }}>
                            Consumo total: {cliente.consumo_total} Wh/día
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#ffe066' }}>
                            Detalles de consumo:
                        </Typography>
                        {Array.isArray(cliente.detalles_consumo) && cliente.detalles_consumo.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                {cliente.detalles_consumo.map((item, idx) => (
                                    <Box key={idx} sx={{ bgcolor: '#23234a', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', boxShadow: 1 }}>
                                        <Typography sx={{ color: '#ffe066', fontWeight: 700, fontSize: 15 }}>
                                            {item.appliance}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5, mb: 0.5 }}>
                                            <Chip label={`Potencia: ${item.power}W`} size="small" sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }} />
                                            <Chip label={`Horas/día: ${item.hours}`} size="small" sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }} />
                                            <Chip label={`Cantidad: ${item.quantity}`} size="small" sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }} />
                                            <Chip label={`Total: ${item.total} Wh/día`} size="small" sx={{ bgcolor: '#ffe066', color: '#181828', fontWeight: 700 }} />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#fff8', mb: 2 }}>No hay detalles de consumo.</Typography>
                        )}
                        <Divider sx={{ my: 2, bgcolor: '#ffe066' }} />
                        <Typography variant="subtitle1" sx={{ color: '#E59CFF', fontWeight: 600, mb: 1 }}>
                            Soluciones solares asociadas:
                        </Typography>
                        {disenos.filter(d => d.cliente_id === cliente.id).length === 0 ? (
                            <Typography variant="body2" sx={{ color: '#fff8' }}>No hay diseños guardados para este cliente.</Typography>
                        ) : (
                            disenos.filter(d => d.cliente_id === cliente.id).map(d => (
                                <Box key={d.id} sx={{ mb: 2, p: 2, bgcolor: '#23234a', borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#ffe066', fontWeight: 700 }}>
                                        Total diseño: ${d.total}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#fff', mt: 1, mb: 1 }}>
                                        Selección de módulos:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                        {d.diseno && Object.entries(d.diseno).map(([moduloIdx, nombre]) => {
                                            // Si es el primer módulo (paneles solares), mostrar cantidad si existe
                                            if (moduloIdx === '0') {
                                                const cantidad = d.diseno.cantidadPaneles || d.cantidadPaneles;
                                                return (
                                                    <Chip
                                                        key={moduloIdx}
                                                        label={cantidad ? `${nombre} (x${cantidad})` : String(nombre)}
                                                        sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }}
                                                    />
                                                );
                                            }
                                            // Si es batería, no mostrar número extraño
                                            if (typeof nombre === 'number') return null;
                                            return (
                                                <Chip key={moduloIdx} label={String(nombre)} sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }} />
                                            );
                                        })}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#aaa', mt: 1 }}>
                                        Guardado: {new Date(d.created_at).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))
                        )}
                    </Paper>
                ))
            )}
        </Box>
    );
}
