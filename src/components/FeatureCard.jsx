import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function FeatureCard({ img, title, desc, imgWidth, animationDelay }) {
    return (
        <Box
            className="feature-card"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4,
                bgcolor: '#000002',
                borderLeft: '1px solid #ffffff14',
                width: { xs: '100%', sm: '100%', md: 300 },
                maxWidth: { xs: '100%', sm: '100%', md: 300 },
                minWidth: { xs: '100%', sm: '100%', md: 300 },
                height: { xs: 320, sm: 320, md: 320 },
                minHeight: { xs: 320, sm: 320, md: 320 },
                maxHeight: { xs: 320, sm: 320, md: 320 },
                m: { xs: '0 0 24px 0', md: 0 },
                position: 'relative',
                animationDelay: animationDelay,
                borderRadius: '30px',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'block', width: imgWidth, maxWidth: 600, maxHeight: 600, m: 0, position: 'relative' }}>
                <img
                    className="feature-card-img"
                    src={img}
                    alt="sl"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </Box>
            <Box sx={{ display: 'block', zIndex: 1, width: 'fit-content', height: 'fit-content', m: 0, minHeight: 10, minWidth: 16, position: 'relative', py: 1.5 }}>
                <Typography sx={{ fontFamily: 'var(--vId-font-token-a, Manrope)', fontSize: 16, fontWeight: 500, color: 'var(--vId-color-token-d, #F4F0FF)', letterSpacing: 0, lineHeight: '24px', opacity: 1 }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ display: 'block', zIndex: 1, width: 'fit-content', height: 'fit-content', m: 0, minHeight: 10, minWidth: 16, position: 'relative', maxWidth: 190, opacity: 0.6 }}>
                <Typography sx={{ fontFamily: 'var(--vId-font-token-a, Manrope)', fontSize: 16, fontWeight: 400, color: 'var(--vId-color-token-d, #F4F0FF)', letterSpacing: 0, lineHeight: '22px' }}>
                    {desc}
                </Typography>
            </Box>
        </Box>
    );
}
