import React, { useEffect, useState } from 'react';
import { MODULOS } from '../data/modulos';
import { PROTECCIONES_OPCIONES } from '../data/protecciones';
import { supabase } from '../supabaseClient';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '', stock: '' });
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProductos();
    }, []);

    // Buscar productos de MODULOS que no existen en la tienda
    const productosDiseno = [
        ...MODULOS.flatMap(m => m.candidatos.map(c => c.nombre)),
        ...PROTECCIONES_OPCIONES.map(p => p.nombre)
    ];
    const productosTienda = productos.map(p => p.nombre);
    const faltantes = productosDiseno.filter(nombre => !productosTienda.includes(nombre));

    const fetchProductos = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('productos').select('*');
        if (!error) setProductos(data || []);
        setLoading(false);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.nombre || !form.precio) return;
        if (editId) {
            await supabase.from('productos').update({ ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) || 0 }).eq('id', editId);
        } else {
            await supabase.from('productos').insert([{ ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) || 0 }]);
        }
        setForm({ nombre: '', descripcion: '', precio: '', imagen: '', stock: '' });
        setEditId(null);
        fetchProductos();
    };

    const handleEdit = producto => {
        setForm({
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: producto.precio || '',
            imagen: producto.imagen || '',
            stock: producto.stock || ''
        });
        setEditId(producto.id);
    };

    const handleDelete = async id => {
        await supabase.from('productos').delete().eq('id', id);
        fetchProductos();
    };

    // Crear producto rápido
    const crearProductoRapido = async (nombre) => {
        // Buscar datos sugeridos en MODULOS o PROTECCIONES_OPCIONES
        let sugerido = MODULOS.flatMap(m => m.candidatos).find(c => c.nombre === nombre)
            || PROTECCIONES_OPCIONES.find(p => p.nombre === nombre);
        let nuevo = {
            nombre,
            descripcion: sugerido?.tipo || sugerido?.descripcion || '',
            precio: sugerido?.precio || 0,
            imagen: sugerido?.imagen || '',
            stock: 0
        };
        await supabase.from('productos').insert([nuevo]);
        fetchProductos();
    };

    return (
        <Box sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: 1100,
            mx: 'auto',
            bgcolor: '#181828',
            borderRadius: 4,
            boxShadow: 6,
            minHeight: '80vh',
            mt: 4
        }}>
            {faltantes.length > 0 && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#fffbe6', borderRadius: 2, color: '#b26a00', fontWeight: 700, border: '1.5px solid #ffe066', boxShadow: 2 }}>
                    Los siguientes productos del diseñador solar no existen en la tienda:<br />
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {faltantes.map(nombre => (
                            <li key={nombre} style={{ marginBottom: 4 }}>
                                {nombre}
                                <Button size="small" variant="contained" color="primary" sx={{ ml: 2, fontWeight: 700 }} onClick={() => crearProductoRapido(nombre)}>
                                    Crear
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: '#E59CFF', textAlign: 'center', letterSpacing: 1 }}>
                Administrar Productos de la Tienda
            </Typography>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 32,
                background: '#23234a',
                borderRadius: 8,
                padding: 16,
                boxShadow: '0 2px 8px #0002'
            }}>
                <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required size="small" />
                <TextField label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} size="small" />
                <TextField label="Precio" name="precio" value={form.precio} onChange={handleChange} required size="small" type="number" />
                <TextField label="Imagen (URL)" name="imagen" value={form.imagen} onChange={handleChange} size="small" />
                <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} size="small" type="number" />
                <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700 }}>
                    {editId ? 'Actualizar' : 'Agregar'}
                </Button>
                {editId && (
                    <Button onClick={() => { setForm({ nombre: '', descripcion: '', precio: '', imagen: '', stock: '' }); setEditId(null); }} color="secondary" variant="outlined">Cancelar</Button>
                )}
            </form>
            <TableContainer component={Paper} sx={{ bgcolor: '#23234a', borderRadius: 3, boxShadow: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>Nombre</TableCell>
                            <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>Descripción</TableCell>
                            <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>Precio</TableCell>
                            <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>Imagen</TableCell>
                            <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>Stock</TableCell>
                            <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6}>Cargando...</TableCell></TableRow>
                        ) : productos.length === 0 ? (
                            <TableRow><TableCell colSpan={6}>No hay productos.</TableCell></TableRow>
                        ) : (
                            productos.map(producto => (
                                <TableRow key={producto.id} sx={{ '&:hover': { background: '#28284a' } }}>
                                    <TableCell sx={{ color: '#ffe066', fontWeight: 700 }}>{producto.nombre}</TableCell>
                                    <TableCell sx={{ color: '#fff', fontStyle: 'italic' }}>{producto.descripcion}</TableCell>
                                    <TableCell sx={{ color: '#4caf50', fontWeight: 700 }}>${producto.precio}</TableCell>
                                    <TableCell>{producto.imagen && <img src={producto.imagen} alt={producto.nombre} style={{ width: 60, borderRadius: 6, border: '2px solid #E59CFF', background: '#fff' }} />}</TableCell>
                                    <TableCell sx={{ color: '#E59CFF', fontWeight: 700 }}>{producto.stock}</TableCell>
                                    <TableCell>
                                        <Button size="small" variant="contained" color="primary" onClick={() => handleEdit(producto)} sx={{ mr: 1, fontWeight: 700 }}>Editar</Button>
                                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(producto.id)} sx={{ fontWeight: 700 }}>Eliminar</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
