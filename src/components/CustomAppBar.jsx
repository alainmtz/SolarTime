import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

export default function CustomAppBar() {
    return (
        <AppBar position="fixed" color="transparent" sx={{ zIndex: 1201 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <img src="/icon.jpg" alt="logo" style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }} />
                    <Typography
                        variant="h6"
                        color="orange"
                        component="div"
                        sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}
                    >
                        FullSolar
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    <Button
                        sx={{
                            color: '#222',
                            background: '#fff',
                            mr: { xs: 1, sm: 2 },
                            fontWeight: 700,
                            borderRadius: 100,
                            px: { xs: 1.5, sm: 3 },
                            minWidth: { xs: 0, sm: 64 },
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            height: { xs: 36, sm: 40 },
                            '&:hover': { background: '#ffe066', color: '#222' },
                        }}
                        href="#contact"
                        startIcon={<EmailIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                    >
                        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Contacto</Box>
                    </Button>
                    <Button
                        sx={{
                            color: '#fff',
                            background: '#25d366',
                            fontWeight: 700,
                            borderRadius: 100,
                            px: { xs: 1.5, sm: 3 },
                            minWidth: { xs: 0, sm: 64 },
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            height: { xs: 36, sm: 40 },
                            '&:hover': { background: '#1ebe57', color: '#fff' },
                        }}
                        href="https://wa.me/+5353921853"
                        target="_blank"
                        startIcon={<WhatsAppIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />}
                    >
                        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>WhatsApp</Box>
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
