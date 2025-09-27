
import React from 'react';
import Box from '@mui/material/Box';
import FeatureCard from './FeatureCard';
import { useNavigate } from 'react-router-dom';


const featureCards = [
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

];

export default function FeatureSection() {
    const navigate = useNavigate();
    return (
        <Box id="featureSection" sx={{ py: 6, px: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'transparent', gap: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    width: '100%',
                    gap: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                {featureCards.map((card, i) => (
                    <FeatureCard
                        key={card.title}
                        {...card}
                        animationDelay={`${i * 0.15}s`}
                        onClick={
                            i === 0
                                ? () => navigate('/disenador')
                                : i === 1
                                    ? () => navigate('/clientes')
                                    : i === 2
                                        ? () => navigate('/tienda')
                                        : undefined
                        }
                        clickable={i === 0 || i === 1 || i === 2}
                    />
                ))}
            </Box>
        </Box>
    );
}
