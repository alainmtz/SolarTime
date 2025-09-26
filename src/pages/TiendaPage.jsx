import React, { useEffect, useState } from 'react';
import { MODULOS } from '../data/modulos';
import { PROTECCIONES_OPCIONES } from '../data/protecciones';
import { supabase } from '../supabaseClient';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

export default function TiendaPage() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Construir categorías desde MODULOS y PROTECCIONES_OPCIONES
    const categorias = [
        ...MODULOS.map(m => m.nombre),
        'Protecciones'
    ];

    useEffect(() => {
        const fetchProductos = async () => {
            const { data, error } = await supabase.from('productos').select('*');
            if (error) {
                console.error('Error al obtener productos:', error);
            }
            setProductos(data || []);
            setLoading(false);
        };
        fetchProductos();
    }, []);

    // Filtrado por categoría y búsqueda
    let productosFiltrados = productos.filter(p => (p.stock ?? 0) > 0);
    if (categoria) {
        if (categoria === 'Protecciones') {
            productosFiltrados = productosFiltrados.filter(p => PROTECCIONES_OPCIONES.some(opt => opt.nombre === p.nombre));
        } else {
            // Buscar por candidatos de la categoría seleccionada
            const mod = MODULOS.find(m => m.nombre === categoria);
            if (mod) {
                const nombres = mod.candidatos.map(c => c.nombre);
                productosFiltrados = productosFiltrados.filter(p => nombres.includes(p.nombre));
            }
        }
    }
    if (busqueda) {
        productosFiltrados = productosFiltrados.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                Tienda Virtual
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ padding: 8, borderRadius: 6, fontSize: 16 }}>
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ padding: 8, borderRadius: 6, fontSize: 16, minWidth: 220 }}
                />
            </Box>
            {loading ? (
                <Typography>Cargando productos...</Typography>
            ) : productosFiltrados.length === 0 ? (
                <Typography>No hay productos disponibles.</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {productosFiltrados.map(producto => (
                        <Card key={producto.id} sx={{ width: 300, bgcolor: '#181828', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
                            {producto.imagen && (
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={producto.imagen}
                                    alt={producto.nombre}
                                    sx={{ objectFit: 'contain', bgcolor: '#23234a' }}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" sx={{ color: '#ffe066', fontWeight: 700 }}>
                                    {producto.nombre}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#E59CFF', mb: 1 }}>
                                    {producto.descripcion}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700, mb: 2 }}>
                                    ${producto.precio}
                                </Typography>
                                <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700 }}>
                                    Comprar
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
