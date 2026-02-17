document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('shape-container');
    const goldCross = document.getElementById('gold-cross');
    if (!container) return;

    const shapesList = [
        'circle', 'square', 'rectangle', 'triangle', 'quadrilateral', 'parallelogram',
        'rhombus', 'trapezoid', 'kite', 'pentagon', 'hexagon', 'heptagon', 'octagon',
        'nonagon', 'decagon', 'hendecagon', 'dodecagon', 'star', 'star6', 'star8',
        'ellipse', 'oval', 'crescent', 'semicircle', 'diamond', 'arrow', 'chevron',
        'cross', 'plus', 'heart', 'teardrop', 'lshape', 'tshape'
    ];

    const numShapes = 45;
    const shapeElements = [];

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        const shapeType = shapesList[Math.floor(Math.random() * shapesList.length)];
        const size = Math.random() * 60 + 20;
        
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;

        shape.className = `background-shape ${shapeType}`;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.position = 'absolute';
        // Random subtle drift velocity for background shapes
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = (Math.random() - 0.5) * 0.4;
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 0.15;

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

    // Gold Cross Logic
    function repositionGoldCross() {
        if (!goldCross) return;
        const x = Math.random() * (window.innerWidth - 60);
        const y = Math.random() * (window.innerHeight - 120);
        goldCross.style.position = 'fixed';
        goldCross.style.left = '0';
        goldCross.style.top = '0';
        goldCross.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    // Initial position
    repositionGoldCross();

    // Expose to window for tab changes
    window.repositionGoldCross = repositionGoldCross;

    function animate() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        shapeElements.forEach(item => {
            item.x += item.vx;
            item.y += item.vy;
            item.rotation += item.rotSpeed;

            if (item.x + item.width < 0) item.x = width;
            else if (item.x > width) item.x = -item.width;

            if (item.y + item.height < 0) item.y = height;
            else if (item.y > height) item.y = -item.height;

            item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg)`;
        });

        // The Gold Cross no longer drifts in the animate loop
        requestAnimationFrame(animate);
    }

    animate();
});
