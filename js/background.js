document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('shape-container');
    if (!container) return;

    const shapes = [
        'circle', 'square', 'rectangle', 'triangle', 'quadrilateral', 'parallelogram',
        'rhombus', 'trapezoid', 'kite', 'pentagon', 'hexagon', 'heptagon', 'octagon',
        'nonagon', 'decagon', 'hendecagon', 'dodecagon', 'star', 'star6', 'star8',
        'ellipse', 'oval', 'crescent', 'semicircle', 'diamond', 'arrow', 'chevron',
        'cross', 'plus', 'heart', 'teardrop', 'lshape', 'tshape'
    ];

    const numShapes = 35;

    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 60 + 20;
        const initialX = Math.random() * (window.innerWidth - size);
        const initialY = Math.random() * (window.innerHeight - size);

        shape.className = `background-shape ${shapeType}`;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${initialX}px`;
        shape.style.top = `${initialY}px`;

        // Store animation properties in data attributes
        shape.dataset.vx = (Math.random() - 0.5) * 0.1; // Slowed down velocity
        shape.dataset.vy = (Math.random() - 0.5) * 0.1; // Slowed down velocity
        shape.dataset.scale = 1;
        shape.dataset.scaleDirection = (Math.random() > 0.5) ? 1 : -1;
        shape.dataset.scaleSpeed = Math.random() * 0.0001 + 0.00005; // Very slow zoom

        container.appendChild(shape);
    }

    function animateShapes() {
        const allShapes = document.querySelectorAll('.background-shape');
        allShapes.forEach(shape => {
            let x = parseFloat(shape.style.left);
            let y = parseFloat(shape.style.top);
            let scale = parseFloat(shape.dataset.scale);

            // Update position based on velocity
            x += parseFloat(shape.dataset.vx);
            y += parseFloat(shape.dataset.vy);

            // Update scale
            scale += parseFloat(shape.dataset.scaleDirection) * parseFloat(shape.dataset.scaleSpeed);
            if (scale > 1.5 || scale < 0.5) { // Change direction at scale limits
                shape.dataset.scaleDirection *= -1;
            }
            shape.dataset.scale = scale;

            // Bounce off the walls
            if (x < 0 || x > window.innerWidth - shape.offsetWidth) {
                shape.dataset.vx *= -1;
            }
            if (y < 0 || y > window.innerHeight - shape.offsetHeight) {
                shape.dataset.vy *= -1;
            }

            shape.style.left = `${x}px`;
            shape.style.top = `${y}px`;
            shape.style.transform = `scale(${scale})`
        });

        requestAnimationFrame(animateShapes);
    }

    animateShapes();
});
