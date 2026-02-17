document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('shape-container');
    if (!container) return;

    const shapesList = [
        'circle', 'square', 'rectangle', 'triangle', 'quadrilateral', 'parallelogram',
        'rhombus', 'trapezoid', 'kite', 'pentagon', 'hexagon', 'heptagon', 'octagon',
        'nonagon', 'decagon', 'hendecagon', 'dodecagon', 'star', 'star6', 'star8',
        'ellipse', 'oval', 'crescent', 'semicircle', 'diamond', 'arrow', 'chevron',
        'cross', 'plus', 'heart', 'teardrop', 'lshape', 'tshape'
    ];

    const numShapes = 40;
    const shapeElements = [];

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        const shapeType = shapesList[Math.floor(Math.random() * shapesList.length)];
        const size = Math.random() * 50 + 15;
        
        // Random initial positions
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;

        shape.className = `background-shape ${shapeType}`;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.position = 'absolute';
        shape.style.opacity = (Math.random() * 0.15 + 0.05).toString();
        
        // Random drift velocity - subtle and consistent
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = (Math.random() - 0.5) * 0.4;
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 0.2;

        container.appendChild(shape);
        
        shapeElements.push({
            el: shape,
            x,
            y,
            vx,
            vy,
            rotation,
            rotSpeed: rotationSpeed,
            width: size,
            height: size
        });
    }

    function animate() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        shapeElements.forEach(item => {
            // Update positions
            item.x += item.vx;
            item.y += item.vy;
            item.rotation += item.rotSpeed;

            // Fluid wrapping logic: if it goes off one side, it appears on the other
            if (item.x + item.width < 0) item.x = width;
            else if (item.x > width) item.x = -item.width;

            if (item.y + item.height < 0) item.y = height;
            else if (item.y > height) item.y = -item.height;

            // Use translate3d for hardware acceleration and sub-pixel smoothness
            item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
    
    // Handle resize to prevent shapes getting stuck outside bounds
    window.addEventListener('resize', () => {
        // Just let the wrap logic handle it naturally in the next frame
    });
});
