import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function GuardarConsumo({ consumoTotal, detallesConsumo }) {
    const [nombre, setNombre] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const handleGuardar = async () => {
        setGuardando(true);
        setMensaje('');
        const { error } = await supabase.from('consumos').insert([
            {
                nombre_cliente: nombre,
                consumo_total: consumoTotal,
                detalles_consumo: detallesConsumo,
            },
        ]);
        setGuardando(false);
        if (error) {
            setMensaje('Error al guardar: ' + error.message);
        } else {
            setMensaje('¡Datos guardados correctamente!');
            setNombre('');
        }
    };

    return (
        <div style={{ marginTop: 24 }}>
            <input
                type="text"
                placeholder="Nombre del cliente"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                style={{ padding: 8, fontSize: 16, marginRight: 8 }}
            />
            <button onClick={handleGuardar} disabled={guardando || !nombre} style={{ padding: 8, fontSize: 16 }}>
                {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            {mensaje && <div style={{ marginTop: 12, color: mensaje.startsWith('¡') ? 'green' : 'red' }}>{mensaje}</div>}
        </div>
    );
}
