document.addEventListener('DOMContentLoaded', function () {
    const shapeContainer = document.getElementById('shape-container');
    const goldCross = document.getElementById('gold-cross');
    const numberOfShapes = 20; // Adjust the number of shapes

    const shapes = [
        'circle', 'square', 'rectangle', 'triangle', 'quadrilateral', 'parallelogram',
        'rhombus', 'trapezoid', 'kite', 'pentagon', 'hexagon', 'heptagon', 'octagon',
        'nonagon', 'decagon', 'hendecagon', 'dodecagon', 'star', 'star6', 'star8',
        'ellipse', 'oval', 'crescent', 'semicircle', 'diamond', 'arrow', 'chevron',
        'cross', 'plus', 'heart', 'teardrop', 'lshape', 'tshape'
    ];

    // Create and animate shapes
    for (let i = 0; i < numberOfShapes; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        shape.classList.add('background-shape', shapeType);

        const size = Math.random() * 80 + 20; // 20px to 100px
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${Math.random() * 100}vh`;
        shape.style.left = `${Math.random() * 100}vw`;

        // Animation properties
        const duration = Math.random() * 40 + 30; // 30-70 seconds
        const dx = (Math.random() - 0.5) * 200; // -100px to 100px
        const dy = (Math.random() - 0.5) * 200; // -100px to 100px
        const rotation = (Math.random() - 0.5) * 720; // -360deg to 360deg

        shape.style.animation = `slow-drift ${duration}s ease-in-out infinite`;
        shape.style.setProperty('--dx', `${dx}px`);
        shape.style.setProperty('--dy', `${dy}px`);
        shape.style.setProperty('--rotation', `${rotation}deg`);

        shapeContainer.appendChild(shape);
    }

    // Animate the gold cross
    if (goldCross) {
        const duration = 20; // seconds
        const dx = (Math.random() - 0.5) * 100;
        const dy = (Math.random() - 0.5) * 100;

        goldCross.style.animation = `slow-drift ${duration}s ease-in-out infinite alternate`;
        goldCross.style.setProperty('--dx', `${dx}px`);
        goldCross.style.setProperty('--dy', `${dy}px`);
        // Start at a random position
        goldCross.style.top = `${Math.random() * 80}vh`;
        goldCross.style.left = `${Math.random() * 80}vw`;
    }
});
