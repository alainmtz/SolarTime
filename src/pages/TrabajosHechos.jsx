import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

export default function TrabajosHechos() {
    //console.log('TrabajosHechos montado');
    const [trabajos, setTrabajos] = useState([]);
    const [consumos, setConsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    //console.log('TrabajosHechos montado');

    useEffect(() => {
        const fetchData = async () => {
            // Obtener trabajos terminados
            const { data: disenos, error } = await supabase
                .from('disenos_solares')
                .select('*');
            if (error) {
                console.error('Supabase error (disenos_solares):', error);
            }
            //console.log('Trabajos recibidos:', disenos);
            // Obtener todos los consumos relacionados
            const { data: consumosData, error: errorConsumos } = await supabase
                .from('consumos')
                .select('*');
            if (errorConsumos) {
                console.error('Supabase error (consumos):', errorConsumos);
            }
            // Filtrar solo los trabajos con estado 'terminado'
            setTrabajos((disenos || []).filter(t => t.estado === 'terminado'));
            setConsumos(consumosData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        //console.log('TrabajosHechos loading:', loading);
        //console.log('TrabajosHechos loading:', loading);
        return <Typography>Cargando...</Typography>;
    }
    //console.log('TrabajosHechos render:', trabajos);

    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                Trabajos Terminados
            </Typography>
            {trabajos.length === 0 ? (
                <Typography>No hay trabajos terminados registrados.</Typography>
            ) : (
                trabajos.map(trabajo => {
                    /*console.log('Renderizando trabajo:', trabajo);*/
                    const consumo = consumos.find(c => c.id === trabajo.cliente_id);
                    return (
                        <Paper key={trabajo.id} sx={{ mb: 4, p: 3, bgcolor: '#181828', color: '#fff' }}>
                            {/*<pre style={{ background: '#222', color: '#E59CFF', fontSize: 12, padding: 8, borderRadius: 6, marginBottom: 12, overflowX: 'auto' }}>
                                {JSON.stringify(trabajo, null, 2)}
                            </pre>
                            <pre style={{ background: '#222', color: '#E59CFF', fontSize: 12, padding: 8, borderRadius: 6, marginBottom: 12, overflowX: 'auto' }}>
                                {JSON.stringify(trabajo, null, 2)}
                            </pre>*/}
                            <Typography variant="h6" sx={{ color: '#ffe066', fontWeight: 700 }}>
                                Cliente: {trabajo.nombre_cliente || trabajo.cliente_id || 'Sin nombre'}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: '#E59CFF', mb: 1 }}>
                                Total: ${trabajo.total}
                            </Typography>
                            <Chip label="TERMINADO Y COBRADO" sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 700, mb: 2 }} />
                            <Divider sx={{ my: 2, bgcolor: '#ffe066' }} />
                            <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
                                Fecha de registro: {new Date(trabajo.updated_at || trabajo.created_at).toLocaleString()}
                            </Typography>
                            {trabajo.observaciones && (
                                <Typography variant="body2" sx={{ color: '#ffe066', mb: 2, fontStyle: 'italic' }}>
                                    Observaciones: {trabajo.observaciones}
                                </Typography>
                            )}
                            {/* Mostrar detalles del consumo relacionado */}
                            {consumo && (
                                <Box sx={{ bgcolor: '#23234a', borderRadius: 2, p: 2, mb: 2, mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#E59CFF', fontWeight: 700 }}>
                                        Detalles de consumo asociado
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#ffe066', mb: 1 }}>
                                        Consumo total: {consumo.consumo_total} Wh/día
                                    </Typography>
                                    {Array.isArray(consumo.detalles_consumo) && consumo.detalles_consumo.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {consumo.detalles_consumo.map((item, idx) => (
                                                <Box key={idx} sx={{ bgcolor: '#181828', borderRadius: 2, p: 1, mb: 1 }}>
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
                                        <Typography variant="body2" sx={{ color: '#fff8' }}>No hay detalles de consumo.</Typography>
                                    )}
                                </Box>
                            )}
                            {/* Mostrar fotos si existen */}
                            {Array.isArray(trabajo.fotos_terminacion) && trabajo.fotos_terminacion.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                                    {trabajo.fotos_terminacion.map((url, idx) => (
                                        <img key={idx} src={url} alt={`Foto ${idx + 1}`} style={{ width: 180, borderRadius: 8, border: '2px solid #E59CFF' }} />
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    );
                })
            )}
        </Box>
    );
}
