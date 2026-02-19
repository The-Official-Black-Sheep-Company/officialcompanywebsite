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
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.position = 'absolute';
        
        // --- Random positioning and movement ---
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;

        // --- Subtle VERY SLOW drift (barely visible) ---
        const dx = (Math.random() * 60 - 30).toFixed(2) + 'px'; 
        const dy = (Math.random() * 60 - 30).toFixed(2) + 'px'; 
        const rotation = (Math.random() * 40 - 20).toFixed(2) + 'deg';
        const duration = (Math.random() * 420 + 180).toFixed(2) + 's'; // 180s - 600s (Extremely slow)
        const opacity = (Math.random() * 0.2 + 0.05).toFixed(2); 

        shape.style.setProperty('--dx', dx);
        shape.style.setProperty('--dy', dy);
        shape.style.setProperty('--rotation', rotation);
        shape.style.setProperty('--duration', duration);
        shape.style.setProperty('--opacity', opacity);

        container.appendChild(shape);
    }

    // Gold Cross is handled purely by CSS for a static position as requested.
});
