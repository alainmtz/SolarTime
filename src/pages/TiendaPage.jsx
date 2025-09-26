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
    const [carrito, setCarrito] = useState([]);
    const [confirmar, setConfirmar] = useState(false);
    const [compraRealizada, setCompraRealizada] = useState(false);
    const [pedidoSinStock, setPedidoSinStock] = useState(false);
    const [productosSinStock, setProductosSinStock] = useState([]);
    // Carrito: agregar producto
    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(p => p.id === producto.id);
            if (existe) {
                return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p);
            } else {
                return [...prev, { ...producto, cantidad: 1 }];
            }
        });
    };

    // Carrito: quitar producto
    const quitarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(p => p.id !== id));
    };

    // Carrito: cambiar cantidad
    const cambiarCantidad = (id, nuevaCantidad) => {
        setCarrito(prev => prev.map(p => p.id === id ? { ...p, cantidad: nuevaCantidad } : p));
    };

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

    // Total carrito
    const totalCarrito = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    // Generar mensaje WhatsApp
    const getMensajeWhatsapp = () => {
        let msg = `¡Hola! Quiero realizar una compra en la tienda virtual:%0A`;
        carrito.forEach(item => {
            msg += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString()}%0A`;
        });
        msg += `Total: $${totalCarrito.toLocaleString()}%0A`;
        msg += `Por favor, confirme disponibilidad y forma de entrega.`;
        return msg;
    };

    const handleComprar = () => {
        setConfirmar(true);
    };

    const handleConfirmarCompra = async () => {
        // Verificar stock suficiente
        const sinStock = carrito.filter(item => (item.stock ?? 0) < item.cantidad);
        if (sinStock.length > 0) {
            // Generar mensaje de falta de stock
            let msg = `¡Hola! Hay un pedido en la tienda virtual, pero NO hay stock suficiente para:%0A`;
            sinStock.forEach(item => {
                msg += `• ${item.nombre} (pedido: ${item.cantidad}, stock: ${item.stock ?? 0})%0A`;
            });
            msg += `Por favor, contacte al cliente para coordinar.`;
            window.open(`https://wa.me/5353921853?text=${msg}`, '_blank');
            setProductosSinStock(sinStock);
            setPedidoSinStock(true);
            setConfirmar(false);
            return;
        }
        // Actualizar stock en la base de datos
        for (const item of carrito) {
            const nuevoStock = (item.stock ?? 0) - item.cantidad;
            await supabase.from('productos').update({ stock: nuevoStock >= 0 ? nuevoStock : 0 }).eq('id', item.id);
        }
        // Abrir WhatsApp con mensaje de compra
        const mensaje = getMensajeWhatsapp();
        window.open(`https://wa.me/5353921853?text=${mensaje}`, '_blank');
        setCompraRealizada(true);
        setCarrito([]);
        setConfirmar(false);
        // Refrescar productos
        const { data, error } = await supabase.from('productos').select('*');
        if (!error) setProductos(data || []);
    };

    const handleCancelarCompra = () => {
        setConfirmar(false);
    };

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', position: 'relative' }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#E59CFF' }}>
                Tienda Virtual
            </Typography>
            {/* Carrito flotante */}
            <Box sx={{
                position: 'fixed',
                top: 90,
                right: 32,
                zIndex: 1202,
                bgcolor: '#23234a',
                color: '#fff',
                borderRadius: 3,
                boxShadow: 6,
                minWidth: 260,
                p: 2,
                display: carrito.length > 0 ? 'block' : 'none',
                border: '2px solid #E59CFF'
            }}>
                <Typography variant="h6" sx={{ color: '#ffe066', fontWeight: 700, mb: 1 }}>Carrito</Typography>
                {carrito.map(item => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <span style={{ fontWeight: 700 }}>{item.nombre}</span>
                        <input type="number" min={1} max={item.stock} value={item.cantidad} onChange={e => cambiarCantidad(item.id, Math.max(1, Math.min(item.stock, parseInt(e.target.value) || 1)))} style={{ width: 48, marginLeft: 8, borderRadius: 4, border: '1px solid #E59CFF', padding: 2 }} />
                        <span style={{ color: '#E59CFF', fontWeight: 700, marginLeft: 4 }}>x ${item.precio}</span>
                        <Button size="small" color="error" onClick={() => quitarDelCarrito(item.id)} sx={{ ml: 1, minWidth: 0, fontWeight: 700 }}>✕</Button>
                    </Box>
                ))}
                <Typography sx={{ color: '#4caf50', fontWeight: 700, mt: 1 }}>Total: ${totalCarrito.toLocaleString()}</Typography>
                <Button variant="contained" color="success" fullWidth sx={{ mt: 2, fontWeight: 700 }} onClick={handleComprar} disabled={carrito.length === 0}>Comprar</Button>
                {confirmar && (
                    <Box sx={{ mt: 2, bgcolor: '#fff', color: '#23234a', borderRadius: 2, p: 2, boxShadow: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>¿Confirmar compra y enviar pedido por WhatsApp?</Typography>
                        <Button variant="contained" color="success" sx={{ mr: 2, fontWeight: 700 }} onClick={handleConfirmarCompra}>Sí, confirmar</Button>
                        <Button variant="outlined" color="error" sx={{ fontWeight: 700 }} onClick={handleCancelarCompra}>Cancelar</Button>
                    </Box>
                )}
                {compraRealizada && (
                    <Typography sx={{ mt: 2, color: '#4caf50', fontWeight: 700 }}>
                        ¡Compra enviada por WhatsApp! Te contactaremos pronto.
                    </Typography>
                )}
                {pedidoSinStock && (
                    <Box sx={{ mt: 2, color: '#ff9800', fontWeight: 700, bgcolor: '#fffbe6', borderRadius: 2, p: 2, border: '1.5px solid #ffe066' }}>
                        <Typography sx={{ fontWeight: 700, mb: 1 }}>
                            Se ha generado un pedido, pero los siguientes productos no tienen stock suficiente:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {productosSinStock.map(item => (
                                <li key={item.id}>
                                    <b>{item.nombre}</b> — Pedidos: {item.cantidad}, Stock disponible: {item.stock ?? 0}
                                </li>
                            ))}
                        </ul>
                        <Typography sx={{ mt: 1 }}>
                            Por favor, espera un mensaje de atención al cliente que llegará en breve para coordinar tu compra.
                        </Typography>
                    </Box>
                )}
            </Box>

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
                                <Button variant="contained" color="secondary" fullWidth sx={{ fontWeight: 700 }} onClick={() => agregarAlCarrito(producto)}>
                                    Añadir al carrito
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
