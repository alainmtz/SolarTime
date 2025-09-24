import React, { useEffect, useRef } from 'react';

// Canvas full-screen background with electric rays following the mouse
export default function ElectricRaysBackground() {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const animationRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);

        function onMouseMove(e) {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        }
        window.addEventListener('mousemove', onMouseMove);

        function drawRay(startX, startY, endX, endY, color, segments = 16, jaggedness = 18) {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 16;
            ctx.lineWidth = 2 + Math.random();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            for (let i = 1; i < segments; i++) {
                const t = i / segments;
                const nx = startX + (endX - startX) * t + (Math.random() - 0.5) * jaggedness;
                const ny = startY + (endY - startY) * t + (Math.random() - 0.5) * jaggedness;
                ctx.lineTo(nx, ny);
            }
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            // Draw 5-8 rays from random points at the edge to the mouse
            const rayCount = 6 + Math.floor(Math.random() * 3);
            for (let i = 0; i < rayCount; i++) {
                const angle = (Math.PI * 2 * i) / rayCount + Math.random() * 0.2;
                const edgeX = width / 2 + Math.cos(angle) * (width * 0.55 + Math.random() * 40);
                const edgeY = height / 2 + Math.sin(angle) * (height * 0.55 + Math.random() * 40);
                drawRay(edgeX, edgeY, mouse.current.x, mouse.current.y, 'rgba(255,255,100,0.7)', 18, 22);
                // Add a blueish secondary ray
                if (Math.random() > 0.5) {
                    drawRay(edgeX, edgeY, mouse.current.x, mouse.current.y, 'rgba(100,200,255,0.25)', 18, 32);
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.45,
            }}
        />
    );
}
