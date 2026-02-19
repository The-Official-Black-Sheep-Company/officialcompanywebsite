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
        
        // --- VASTLY DIVERSIFIED SIZES ---
        // Range from 2px (dust) to 400px (giant atmospheric shapes)
        const sizeOptions = [
            Math.floor(Math.random() * 10) + 2,    // Tiny: 2-12px
            Math.floor(Math.random() * 40) + 15,   // Small: 15-55px
            Math.floor(Math.random() * 100) + 60,  // Medium: 60-160px
            Math.floor(Math.random() * 250) + 150  // Large: 150-400px
        ];
        const size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
        
        // Random scale (0.5x to 1.5x of base size) for extra variety
        const scale = (Math.random() * 1.0 + 0.5).toFixed(2);

        shape.className = `background-shape ${shapeType}`;
        shape.style.setProperty('--shape-size', `${size}px`);
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.position = 'absolute';
        
        // --- Random positioning ---
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;

        // --- SUBTLE RANDOM SPEEDS (Barely visible drift) ---
        // Range from tiny wobbles to slow drifts across the screen
        const dx = (Math.random() * 200 - 100).toFixed(2) + 'px'; 
        const dy = (Math.random() * 200 - 100).toFixed(2) + 'px'; 
        const rotation = (Math.random() * 360 - 180).toFixed(2) + 'deg';
        
        // Very long durations for 'barely visible' effect
        const duration = (Math.random() * 600 + 300).toFixed(2) + 's'; // 5min - 15min
        
        // Variety in transparency and blur for depth
        const opacity = (Math.random() * 0.15 + 0.02).toFixed(3); 
        const blur = (Math.random() * 4).toFixed(1); // 0px to 4px blur

        shape.style.setProperty('--dx', dx);
        shape.style.setProperty('--dy', dy);
        shape.style.setProperty('--rotation', rotation);
        shape.style.setProperty('--duration', duration);
        shape.style.setProperty('--opacity', opacity);
        shape.style.filter = `blur(${blur}px)`;
        shape.style.transform = `scale(${scale})`;
        
        // Extra hint for the persistent transform base
        shape.style.setProperty('--base-transform', `scale(${scale})`);

        container.appendChild(shape);
    }

    // Gold Cross is handled purely by CSS for a static position as requested.
});
