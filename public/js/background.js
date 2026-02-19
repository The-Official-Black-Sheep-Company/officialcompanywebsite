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

    const numShapes = Math.floor(Math.random() * 201) + 50; // 50-250 shapes for more randomness
    const shapeElements = [];

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        const shapeType = shapesList[Math.floor(Math.random() * shapesList.length)];
        
        // Diversify sizes: from tiny to large
        const sizeOptions = [
            Math.floor(Math.random() * 21) + 5,   // Tiny: 5-25px
            Math.floor(Math.random() * 51) + 25,  // Small: 25-75px
            Math.floor(Math.random() * 101) + 75, // Medium: 75-175px
            Math.floor(Math.random() * 201) + 150 // Large: 150-350px
        ];
        const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];

        shape.className = `background-shape ${shapeType}`;
        shape.style.setProperty('--shape-size', `${size}px`);
        shape.style.position = 'absolute';
        
        // --- Random positioning and movement ---
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;

        // --- Subtle slow drift via CSS variables ---
        const dx = (Math.random() * 1000 - 500).toFixed(2) + 'px'; // Increase drift range
        const dy = (Math.random() * 1000 - 500).toFixed(2) + 'px'; // Increase drift range
        const rotation = (Math.random() * 720 - 360).toFixed(2) + 'deg';
        const duration = (Math.random() * 400 + 40).toFixed(2) + 's'; // 40s - 440s
        const opacity = (Math.random() * 0.5 + 0.05).toFixed(2); // Lower opacity for more subtlety

        shape.style.setProperty('--dx', dx);
        shape.style.setProperty('--dy', dy);
        shape.style.setProperty('--rotation', rotation);
        shape.style.setProperty('--duration', duration);
        shape.style.setProperty('--opacity', opacity);

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
