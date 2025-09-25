import React from 'react';
import SolarSVG from './SolarSVG';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function SolucionesCard({ image, icon, description, useSVG }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: { xs: '100%', sm: '100%', md: 470 },
                maxWidth: { xs: '100%', md: 470 },
                border: '1px solid #ffffff19',
                bgcolor: 'rgba(0,0,2,0.98)',
                borderRadius: 3,
                overflow: 'hidden',
                m: { xs: '0 0 24px 0', md: 1 },
                boxShadow: 0,
            }}
        >
            <Box sx={{ width: '100%', height: 230, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#000' }}>
                {useSVG ? (
                    <SolarSVG />
                ) : (
                    <img src={image} alt="sl" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ width: 37, height: 30, mb: 1 }}>
                    <img src={icon} alt="icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Typography sx={{ fontFamily: 'var(--vId-font-token-a)', fontSize: 14, fontWeight: 400, color: '#FFFFFFB2', lineHeight: '24px', pt: 1, textAlign: 'left' }}>
                    {description}
                </Typography>
            </Box>
        </Box>
    );
}

export default function SolucionesSolaresCompletas() {
    return (
        <Box id="solucionesSolaresCompletas" sx={{
            py: 12,
            px: 2,
            bgcolor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1980px',
            m: '0 auto',
            position: 'relative',
        }}>
            <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', borderRadius: 4, mb: 2 }}>
                    <Box sx={{ px: 2, py: 0.5, bgcolor: 'linear-gradient(90deg, rgba(229,156,255,0.24) 0.01%, rgba(186,156,255,0.24) 50.01%, rgba(156,178,255,0.24) 100%)', borderRadius: 4, mb: 2 }}>
                        <Typography sx={{ fontFamily: 'var(--vId-font-token-a)', fontSize: 35, fontWeight: 500, background: 'linear-gradient(90deg, #E59CFF 0.01%, #BA9CFF 50.01%, #9CB2FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '40px', m: 0 }}>
                            Su socio energético
                        </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: 'var(--vId-font-token-a)', fontSize: 50, fontWeight: 600, color: 'var(--vId-color-token-d, #F4F0FF)', letterSpacing: '-2px', lineHeight: '60px', py: 2, textAlign: 'center' }}>
                        Soluciones solares completas
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--vId-font-token-a)', fontSize: 18, fontWeight: 500, color: 'var(--vId-color-token-d, #F4F0FF)', opacity: 0.7, lineHeight: '28px', textAlign: 'center', maxWidth: 660, mb: 4 }}>
                        Ofrecemos soluciones solares integrales, desde el diseño del sistema y la compra en línea hasta el análisis detallado del consumo de energía, lo que le permite lograr la independencia energética.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center',
                        gap: 2,
                        width: '100%',
                        pt: 8,
                        alignItems: { xs: 'stretch', md: 'flex-start' },
                    }}
                >
                    <SolucionesCard
                        useSVG
                        icon="https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-36ce3f25"
                        description="Nuestro diseñador de sistemas solares en línea le permite visualizar y personalizar su configuración solar, asegurándose de que cumpla perfectamente con los requisitos energéticos y las preferencias estéticas únicas de su hogar."
                    />
                    <SolucionesCard
                        image="/electrodomesticos.jpg"
                        icon="https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-48f58283"
                        description="El formulario de consumo eléctrico lo ayuda a estimar con precisión el uso de energía de su hogar al ingresar detalles sobre sus electrodomésticos, lo que proporciona una imagen clara para la planificación del sistema solar."
                    />
                </Box>
            </Box>
        </Box>
    );
}
