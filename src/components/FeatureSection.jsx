
import React from 'react';
import Box from '@mui/material/Box';
import FeatureCard from './FeatureCard';
import { useNavigate } from 'react-router-dom';

const firstRow = [
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-cd41a09e',
        title: 'Diseño solar',
        desc: 'Diseñe sin esfuerzo su sistema solar personalizado en línea con nuestras herramientas intuitivas.',
        imgWidth: 31,
    },
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-570b3179',
        title: 'Registro de clientes y soluciones solares',
        desc: 'Encuentre los productos solares perfectos y el asesoramiento de expertos para sus necesidades.',
        imgWidth: 40,
    },
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-f1dd7c0d',
        title: 'Tienda en línea',
        desc: 'Compre una amplia gama de productos solares de alta calidad para su hogar.',
        imgWidth: 31,
    },
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-842e4a67',
        title: 'Forma de consumo',
        desc: 'Calcule las necesidades energéticas de su hogar con precisión con nuestro formulario.',
        imgWidth: 31,
    },
];

const secondRow = [
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-708cb3f6',
        title: 'Ahorro de energía',
        desc: 'Descubra cómo la energía solar puede reducir significativamente sus facturas de electricidad.',
        imgWidth: 28,
    },
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-220cbd5e',
        title: 'Catálogo de productos',
        desc: 'Explore y seleccione de nuestra amplia colección de equipos solares.',
        imgWidth: 23,
    },
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-ff0eb91c',
        title: 'Datos del dispositivo',
        desc: 'Ingrese los electrodomésticos de su hogar para un análisis preciso del consumo de energía.',
        imgWidth: 38,
    },
    {
        img: 'https://assets-v2.codedesign.ai/storage/v1/object/public/68cb0218d968205df284e7c2_e9e4b65d/asset-4932d875',
        title: 'Diseño del sistema',
        desc: 'Visualice y planifique su sistema de energía solar ideal con facilidad.',
        imgWidth: 36,
    },
];

export default function FeatureSection() {
    const navigate = useNavigate();
    return (
        <Box id="featureSection" sx={{ py: 6, px: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', gap: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    alignItems: { xs: 'stretch', md: 'flex-start' },
                    gap: 1,
                }}
            >
                {firstRow.map((card, i) => (
                    <FeatureCard
                        key={card.title}
                        {...card}
                        animationDelay={`${i * 0.15}s`}
                        onClick={
                            i === 0
                                ? () => navigate('/disenador')
                                : i === 1
                                    ? () => navigate('/clientes')
                                    : undefined
                        }
                        clickable={i === 0 || i === 1}
                    />
                ))}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    gap: 1,
                    alignItems: { xs: 'stretch', md: 'flex-start' },
                }}
            >
                {secondRow.map((card, i) => (
                    <FeatureCard key={card.title} {...card} animationDelay={`${i * 0.15}s`} />
                ))}
            </Box>
        </Box>
    );
}
