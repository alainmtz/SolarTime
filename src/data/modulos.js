// src/data/modulos.js
export const MODULOS = [
    {
        nombre: 'Paneles Solares',
        imagen: 'https://www.svgrepo.com/show/236459/solar-energy-solar-panel.svg',
        candidatos: [
            { nombre: 'Panel SunEvo 580W', imagen: '/paneles/sunevo580.jpg', precio: '240', producto_id: null },
            { nombre: 'Panel Jinko 590W', imagen: '/paneles/panel-jinko-solar-590w.jpg', precio: '250', producto_id: null },
        ],
    },
    {
        nombre: 'Inversores',
        imagen: 'https://www.svgrepo.com/show/235546/renewable-energy-power.svg',
        candidatos: [
            { nombre: 'Inversor MFUZOP 2kW', imagen: '/inversores/inversor_simple_OSP_2kw.jpg', precio: '700', producto_id: null },
            { nombre: 'Inversor MUST 3kW', imagen: '/inversores/must3kw110_220.jpg', precio: '720', producto_id: null },
            { nombre: 'Inversor 4kW', imagen: '/inversores/sumry4kw.jpg', precio: '720', producto_id: null },
            { nombre: 'Inversor 5kW', imagen: '/inversores/ECO-WORTHY5kw.jpg', precio: '1550', producto_id: null },
            { nombre: 'PowMr Alta Frecuencia 10kW', imagen: '/inversores/powmr10kw.jpg', precio: '2100', producto_id: null },
            { nombre: 'PowMr Baja Frecuencia 10kW', imagen: '/inversores/powmr10kw.jpg', precio: '2500', producto_id: null },
        ],
    },
    {
        nombre: 'Baterías',
        imagen: 'https://www.svgrepo.com/show/444310/gui-battery-charged.svg',
        candidatos: [
            { nombre: 'Batería DC-House 1280Wh', imagen: '/baterias/dchouse12V100A.jpg', voltage: '12V', Amperage: '100Ah', precio: '340', producto_id: null },
            { nombre: 'Batería dumfume 1280Wh', imagen: '/baterias/dumfume 12v-100A.jpg', voltage: '12V', Amperage: '100Ah', precio: '340', producto_id: null },
            { nombre: 'Batería MFUZOP 1280Wh', imagen: '/baterias/mfuzop12v100A.jpg', voltage: '12V', Amperage: '300Ah', precio: '350', producto_id: null },
            { nombre: 'Batería MFUZOP 3840Wh', imagen: '/baterias/mfuzomp12v300A.jpg', voltage: '12V', Amperage: '300Ah', precio: '770', producto_id: null },
            { nombre: 'Batería Humsienk 2560Wh', imagen: '/baterias/humsienk24v100a.jpg', voltage: '24V', Amperage: '100Ah', precio: '770', producto_id: null },
            { nombre: 'Batería DC-House 2560Wh', imagen: '/baterias/dc256.jpg', voltage: '24V', Amperage: '100Ah', precio: '770', producto_id: null },
            { nombre: 'Batería DC-House 5100Wh', imagen: '/baterias/dc51v.jpg', voltage: '51V', Amperage: '100Ah', precio: '1500', producto_id: null },
        ],
    },
];
