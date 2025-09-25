import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function GuardarDisenoSolar({ diseno, total, onSaved }) {
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        // Cargar clientes existentes
        const fetchClientes = async () => {
            const { data, error } = await supabase.from('consumos').select('id, nombre_cliente');
            if (!error && data) setClientes(data);
        };
        fetchClientes();
    }, []);

    const handleGuardar = async () => {
        setGuardando(true);
        setMensaje('');
        const { error } = await supabase.from('disenos_solares').insert([
            {
                cliente_id: clienteId,
                diseno: diseno,
                total: total,
            },
        ]);
        setGuardando(false);
        if (error) {
            setMensaje('Error al guardar: ' + error.message);
        } else {
            setMensaje('¡Diseño guardado correctamente!');
            if (onSaved) onSaved();
        }
    };

    return (
        <div style={{ marginTop: 24 }}>
            <select value={clienteId} onChange={e => setClienteId(e.target.value)} style={{ padding: 8, fontSize: 16, marginRight: 8 }}>
                <option value="">Selecciona un cliente</option>
                {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre_cliente}</option>
                ))}
            </select>
            <button onClick={handleGuardar} disabled={guardando || !clienteId} style={{ padding: 8, fontSize: 16 }}>
                {guardando ? 'Guardando...' : 'Guardar diseño'}
            </button>
            {mensaje && <div style={{ marginTop: 12, color: mensaje.startsWith('¡') ? 'green' : 'red' }}>{mensaje}</div>}
        </div>
    );
}
