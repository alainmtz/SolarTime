import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95vw', sm: 420 },
    bgcolor: 'rgba(10,10,20,0.98)',
    border: '2px solid #ffe066',
    boxShadow: 24,
    borderRadius: 6,
    p: 4,
    color: '#fff',
};

export default function ConsumoCalculatorModal({ open, onClose }) {
    const [form, setForm] = useState({
        appliance: '',
        power: '',
        hours: '',
        quantity: '',
    });
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleAdd = () => {
        if (!form.appliance || !form.power || !form.hours || !form.quantity) return;
        const power = Number(form.power);
        const hours = Number(form.hours);
        const quantity = Number(form.quantity);
        setResults([
            ...results,
            {
                ...form,
                total: power * hours * quantity,
                perHour: power * quantity,
            },
        ]);
        setForm({ appliance: '', power: '', hours: '', quantity: '' });
    };

    const totalConsumo = results.reduce((acc, item) => acc + item.total, 0);
    const totalPorHora = results.reduce((acc, item) => acc + (item.perHour || 0), 0);

    // Generar texto para compartir
    const shareText = () => {
        if (results.length === 0) return '';
        let text = 'Consumo eléctrico estimado:\n';
        results.forEach(item => {
            text += `• ${item.appliance}: ${item.power}W x ${item.hours}h x ${item.quantity} = ${item.total} Wh/día (por hora: ${item.perHour} Wh/h)\n`;
        });
        text += `\nConsumo total: ${totalConsumo} Wh/día\nConsumo total por hora: ${totalPorHora} Wh/h`;
        return encodeURIComponent(text);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="consumo-modal-title" >
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography id="consumo-modal-title" variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        Calculadora de Consumo Eléctrico
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#ffe066' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <TextField
                        label="Electrodoméstico"
                        name="appliance"
                        value={form.appliance}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{ style: { color: '#fff' } }}
                        InputLabelProps={{ style: { color: '#ffe066' } }}
                    />
                    <TextField
                        label="Potencia (W)"
                        name="power"
                        value={form.power}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        type="number"
                        fullWidth
                        InputProps={{ style: { color: '#fff' } }}
                        InputLabelProps={{ style: { color: '#ffe066' } }}
                    />
                    <TextField
                        label="Horas al día"
                        name="hours"
                        value={form.hours}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        type="number"
                        fullWidth
                        InputProps={{ style: { color: '#fff' } }}
                        InputLabelProps={{ style: { color: '#ffe066' } }}
                    />
                    <TextField
                        label="Cantidad"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        type="number"
                        fullWidth
                        InputProps={{ style: { color: '#fff' } }}
                        InputLabelProps={{ style: { color: '#ffe066' } }}
                    />
                    <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: '#ffe066', color: '#222', fontWeight: 700, borderRadius: 100 }}>
                        Agregar
                    </Button>
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: '#ffe066', fontWeight: 600 }}>
                        Lista de Consumo
                    </Typography>
                    {results.length === 0 ? (
                        <Typography variant="body2" sx={{ color: '#fff8' }}>No hay datos aún.</Typography>
                    ) : (
                        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                            {results.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: 4 }}>
                                    <span style={{ color: '#ffe066', fontWeight: 600 }}>{item.appliance}</span> — {item.power}W × {item.hours}h × {item.quantity} = <b>{item.total} Wh/día</b>
                                    <br />
                                    <span style={{ color: '#fff8', fontSize: 13 }}>
                                        Consumo por hora: <b>{item.perHour} Wh/h</b>
                                    </span>
                                </li>
                            ))}
                        </Box>
                    )}
                    <Typography variant="h6" sx={{ mt: 2, color: '#ffe066', fontWeight: 700 }}>
                        Consumo total: {totalConsumo} Wh/día
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#ffe066', fontWeight: 600 }}>
                        Consumo total por hora: {totalPorHora} Wh/h
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<WhatsAppIcon />}
                        sx={{ mt: 2, borderRadius: 100, fontWeight: 700 }}
                        disabled={results.length === 0}
                        component="a"
                        href={`https://wa.me/+5355550152?text=${shareText()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Compartir por WhatsApp
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
