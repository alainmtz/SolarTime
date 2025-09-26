import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { supabase } from '../supabaseClient';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
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
            const { data: consumos } = await supabase
                .from('consumos')
                .select('*');
            // Obtener disenos
            const { data: disenosData } = await supabase
                .from('disenos_solares')
                .select('*');
            setClientes(consumos || []);
            setDisenos(disenosData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    const [uploadingId, setUploadingId] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [compressedSizes, setCompressedSizes] = useState({});
    const [saving, setSaving] = useState(false);
    const [previewUrls, setPreviewUrls] = useState({});

    // Eliminar imagen seleccionada antes de subir
    const handleRemoveImage = (disenoId, idx) => {
        setPreviewUrls(prev => {
            const urls = prev[disenoId] ? [...prev[disenoId]] : [];
            urls.splice(idx, 1);
            return { ...prev, [disenoId]: urls };
        });
        setSelectedFiles(prev => {
            const files = prev[disenoId] ? Array.from(prev[disenoId]) : [];
            files.splice(idx, 1);
            // Crear un objeto FileList simulado
            const dt = new DataTransfer();
            files.forEach(f => dt.items.add(f));
            return { ...prev, [disenoId]: dt.files };
        });
        setCompressedSizes(prev => {
            const sizes = prev[disenoId] ? [...prev[disenoId]] : [];
            sizes.splice(idx, 1);
            return { ...prev, [disenoId]: sizes };
        });
    };

    if (loading) return <Typography>Cargando...</Typography>;

    return (
        <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                Clientes y Soluciones Solares
            </Typography>
            {clientes.filter(c => c.estado !== 'terminado').length === 0 ? (
                <Typography>No hay clientes registrados.</Typography>
            ) : (
                clientes.filter(c => c.estado !== 'terminado').map(cliente => (
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
                            disenos.filter(d => d.cliente_id === cliente.id && d.estado !== 'terminado').map(d => (
                                <Box key={d.id} sx={{ mb: 2, p: 2, bgcolor: '#23234a', borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#ffe066', fontWeight: 700 }}>
                                        Total diseño: ${d.total}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#fff', mt: 1, mb: 1 }}>
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                        {(() => {
                                            let disenoObj = d.diseno;
                                            if (typeof disenoObj === 'string') {
                                                try {
                                                    disenoObj = JSON.parse(disenoObj);
                                                } catch {
                                                    return null;
                                                }
                                            }
                                            if (!disenoObj) return null;
                                            // Módulos
                                            const modulosChips = Object.entries(disenoObj).map(([moduloIdx, nombre]) => {
                                                if (moduloIdx === 'protecciones' || moduloIdx === 'totalModulos' || moduloIdx === 'totalProtecciones' || moduloIdx === 'cantidadPaneles') return null;
                                                if (moduloIdx === '0') {
                                                    const cantidad = disenoObj.cantidadPaneles || d.cantidadPaneles;
                                                    return (
                                                        <Chip
                                                            key={moduloIdx}
                                                            label={cantidad ? `${nombre} (x${cantidad})` : String(nombre)}
                                                            sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }}
                                                        />
                                                    );
                                                }
                                                if (typeof nombre === 'number') return null;
                                                return (
                                                    <Chip key={moduloIdx} label={String(nombre)} sx={{ bgcolor: '#E59CFF', color: '#181828', fontWeight: 700 }} />
                                                );
                                            });
                                            // Protecciones/aditamentos
                                            const protArr = Array.isArray(disenoObj.protecciones) ? disenoObj.protecciones : [];
                                            const protChips = protArr.map((p, idx) => {
                                                if (!p || typeof p !== 'object') return null;
                                                if (p.nombre === 'Cable solar m') {
                                                    return (
                                                        <Chip key={'cable' + idx} label={`Cable solar x${p.metros || p.cantidad} m`} sx={{ bgcolor: '#ffe066', color: '#181828', fontWeight: 700 }} />
                                                    );
                                                }
                                                let label = p.nombre || '';
                                                if (p.cantidad) label += ` x${p.cantidad}`;
                                                if (p.tipo) label += ` (${p.tipo})`;
                                                return (
                                                    <Chip key={'prot' + idx} label={label} sx={{ bgcolor: '#BA9CFF', color: '#181828', fontWeight: 700 }} />
                                                );
                                            });
                                            return <>{modulosChips}{protChips}</>;
                                        })()}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#aaa', mt: 1 }}>
                                        Guardado: {new Date(d.created_at).toLocaleString()}
                                    </Typography>
                                    {/* Botón para marcar como terminado y cobrado */}
                                    {d.estado !== 'terminado' && (
                                        <Box sx={{ mt: 2 }}>
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                setSaving(true); setUploadingId(d.id);
                                                let fotos = [];
                                                if (selectedFiles[d.id]) {
                                                    const filesArr = Array.from(selectedFiles[d.id]);
                                                    for (const file of filesArr) {
                                                        // Comprimir imagen a tamaño SD (ej: máx 1024x768, calidad 0.7)
                                                        const options = {
                                                            maxWidthOrHeight: 1024,
                                                            initialQuality: 0.7,
                                                        };
                                                        let compressedFile = file;
                                                        try {
                                                            compressedFile = await imageCompression(file, options);
                                                        } catch (err) {
                                                            // Si falla, sube el original
                                                            console.log('error al comprimir imagen' + err)
                                                        }
                                                        const fileExt = file.name.split('.').pop();
                                                        const fileName = `${d.id}_${uuidv4()}.${fileExt}`;
                                                        /*const filePath = `trabajos/${fileName}`;*/
                                                        const { error } = await supabase.storage.from('trabajos').upload(fileName, compressedFile, { upsert: true });
                                                        if (!error) {
                                                            const { data: urlData } = supabase.storage.from('trabajos').getPublicUrl(fileName);
                                                            if (urlData && urlData.publicUrl) fotos.push(urlData.publicUrl);
                                                        }
                                                    }
                                                }
                                                const obs = e.target['obs' + d.id]?.value || '';
                                                const { error: updateError, data: updateData } = await supabase
                                                    .from('disenos_solares')
                                                    .update({ estado: 'terminado', fotos_terminacion: fotos, observaciones: obs })
                                                    .eq('id', d.id);
                                                if (updateError) {
                                                    alert('Error al actualizar estado: ' + updateError.message);
                                                    console.error('Update error:', updateError);
                                                } else {
                                                    // Marcar también el consumo relacionado como terminado
                                                    if (d.cliente_id) {
                                                        const { error: consumoError } = await supabase
                                                            .from('consumos')
                                                            .update({ estado: 'terminado' })
                                                            .eq('id', d.cliente_id);
                                                        if (consumoError) {
                                                            alert('Error al actualizar estado en consumos: ' + consumoError.message);
                                                            console.error('Consumo update error:', consumoError);
                                                        }
                                                    }
                                                    console.log('Update OK:', updateData);
                                                    setSaving(false); setUploadingId(null);
                                                    window.location.reload();
                                                }
                                            }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    disabled={saving && uploadingId === d.id}
                                                    type="submit"
                                                    startIcon={<CloudUploadIcon />}
                                                >
                                                    Marcar como terminado y cobrado
                                                </Button>
                                                <label htmlFor={`file-upload-${d.id}`} style={{ display: 'block', marginTop: 8 }}>
                                                    <input
                                                        id={`file-upload-${d.id}`}
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        style={{ display: 'none' }}
                                                        onChange={async e => {
                                                            setSelectedFiles({ ...selectedFiles, [d.id]: e.target.files });
                                                            // Previsualización
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                const filesArr = Array.from(e.target.files);
                                                                const urls = filesArr.map(file => URL.createObjectURL(file));
                                                                setPreviewUrls(s => ({ ...s, [d.id]: urls }));
                                                                // Procesar y mostrar tamaño comprimido
                                                                const sizes = [];
                                                                for (const file of filesArr) {
                                                                    let compressedFile = file;
                                                                    try {
                                                                        compressedFile = await imageCompression(file, { maxWidthOrHeight: 1024, initialQuality: 0.7 });
                                                                    } catch (error) {
                                                                        console.log('Error compressing image:', error);
                                                                    }
                                                                    sizes.push(compressedFile.size);
                                                                }
                                                                setCompressedSizes(s => ({ ...s, [d.id]: sizes }));
                                                            } else {
                                                                setCompressedSizes(s => ({ ...s, [d.id]: [] }));
                                                                setPreviewUrls(s => ({ ...s, [d.id]: [] }));
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        component="span"
                                                        startIcon={<CloudUploadIcon />}
                                                        sx={{
                                                            borderRadius: 3,
                                                            borderWidth: 2,
                                                            fontWeight: 700,
                                                            bgcolor: '#23234a',
                                                            color: '#E59CFF',
                                                            borderColor: '#E59CFF',
                                                            '&:hover': {
                                                                bgcolor: '#E59CFF',
                                                                color: '#23234a',
                                                                borderColor: '#E59CFF',
                                                            },
                                                            mt: 0.5,
                                                            mb: 1
                                                        }}
                                                    >
                                                        Seleccionar imágenes
                                                    </Button>
                                                </label>
                                                {/* Previsualización de imágenes */}
                                                {previewUrls[d.id] && previewUrls[d.id].length > 0 && (
                                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                        {previewUrls[d.id].map((url, idx) => (
                                                            <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                                                                <img src={url} alt={`preview ${idx + 1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #E59CFF' }} />
                                                                <IconButton size="small" onClick={() => handleRemoveImage(d.id, idx)} style={{ position: 'absolute', top: -10, right: -10, background: '#fff', padding: 2 }}>
                                                                    <DeleteIcon fontSize="small" style={{ color: '#E59CFF' }} />
                                                                </IconButton>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {compressedSizes[d.id] && compressedSizes[d.id].length > 0 && (
                                                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                                        {compressedSizes[d.id].map((sz, idx) => (
                                                            <span key={idx}>
                                                                Imagen {idx + 1}: {(sz / 1024).toFixed(1)} KB<br />
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <textarea
                                                    name={'obs' + d.id}
                                                    placeholder="Observaciones (opcional)"
                                                    style={{ width: '100%', marginTop: 8, borderRadius: 6, padding: 6, minHeight: 40 }}
                                                />
                                            </form>
                                        </Box>
                                    )}
                                    {d.estado === 'terminado' && (
                                        <Chip label="TERMINADO Y COBRADO" sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 700, mt: 2 }} />
                                    )}
                                    {/* Mostrar fotos de terminación si existen */}
                                    {Array.isArray(d.fotos_terminacion) && d.fotos_terminacion.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                                            {d.fotos_terminacion.map((url, idx) => (
                                                <img key={idx} src={url} alt={`Foto ${idx + 1}`} style={{ width: 120, borderRadius: 8, border: '2px solid #E59CFF' }} />
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            ))
                        )}

                    </Paper>
                ))
            )}
        </Box>
    );
}
