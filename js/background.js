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
        
        // --- Random positioning and movement ---
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;

        // --- Subtle slow drift via CSS variables ---
        const dx = (Math.random() * 40 - 20).toFixed(2) + 'px';
        const dy = (Math.random() * 40 - 20).toFixed(2) + 'px';
        const rotation = (Math.random() * 360).toFixed(2) + 'deg';
        const duration = (Math.random() * 240 + 240).toFixed(2) + 's'; // 4-8 minutes

        shape.style.setProperty('--dx', dx);
        shape.style.setProperty('--dy', dy);
        shape.style.setProperty('--rotation', rotation);
        shape.style.setProperty('--duration', duration);

        container.appendChild(shape);
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
});
