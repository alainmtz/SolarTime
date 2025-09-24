import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ConsumoCalculatorModal from './ConsumoCalculatorModal';

export default function HeroSection() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Box id="heroSection" sx={{ bgcolor: 'transparent', py: 10, px: 2, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 800,
                        mb: 3,
                        fontSize: { xs: 32, md: 48 },
                        fontFamily: 'Manrope, Nunito Sans, sans-serif',
                        textShadow:
                            '0 0 12px #ffe066, 0 0 24px #fff200, 0 0 36px #fff200, 0 0 48px #fff200',
                        animation: 'glowBlink 6s ease-in-out infinite',
                        '@keyframes glowBlink': {
                            '0%, 100%': {
                                textShadow: '0 0 12px #ffe066, 0 0 24px #fff200, 0 0 36px #fff200, 0 0 48px #fff200',
                            },
                            '50%': {
                                textShadow: '0 0 2px #ffe066, 0 0 4px #fff200, 0 0 6px #fff200, 0 0 8px #fff200',
                            },
                        },
                    }}
                >
                    Energía solar a tu medida
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 400, mb: 4, maxWidth: 600, mx: 'auto', fontSize: { xs: 18, md: 22 }, fontFamily: 'Nunito Sans, sans-serif', lineHeight: 1.4 }}>
                    Diseña, visualiza y cotiza tu sistema solar personalizado en minutos. Fácil, rápido y sin compromiso.
                </Typography>
                <Button
                    variant="contained"
                    color="yellow"
                    size="large"
                    sx={{ borderRadius: 100, px: 6, py: 2, fontWeight: 700, fontSize: 22, boxShadow: '0 2px 16px #7762f544', fontFamily: 'var(--vId-font-token-a, Manrope)' }}
                    onClick={() => setOpen(true)}
                >
                    ¡Comienza ahora!
                </Button>
            </Box>
            <ConsumoCalculatorModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
