document.addEventListener('DOMContentLoaded', () => {
    // --- Gold Cross ---
    function positionGoldCross() {
        const goldCross = document.getElementById('gold-cross');
        if (!goldCross) return;
        const left = Math.random() * 80 + 10; // 10-90%
        const top = Math.random() * 80 + 10;  // 10-90%
        goldCross.style.left = left + '%';
        goldCross.style.top = top + '%';
        goldCross.style.transform = 'translate(-50%, -50%)';
    }

    // --- Random Background Shapes ---
    function generateRandomShapes() {
        const container = document.getElementById('shape-container');
        if (!container) return;

        // Remove old shapes
        container.querySelectorAll('.background-shape').forEach(el => el.remove());

        const shapeTypes = [
            'circle','square','rectangle','triangle','parallelogram','rhombus','trapezoid','kite',
            'pentagon','hexagon','heptagon','octagon','nonagon','decagon','star','star6','star8',
            'ellipse','oval','crescent','semicircle','diamond','arrow','chevron','cross','plus','heart','teardrop',
            'lshape','tshape'
        ];

        const numShapes = Math.floor(Math.random() * 201); // 0-200

        for (let i = 0; i < numShapes; i++) {
            const shape = document.createElement('div');
            const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const size = Math.floor(Math.random() * 158) + 2; // 2-159px
            shape.className = `background-shape ${type}`;
            shape.style.width = size + 'px';
            shape.style.height = size + 'px';
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.transform = `rotate(${Math.random() * 360}deg)`;

            // --- Subtle slow drift ---
            const dx = (Math.random() * 20 - 10).toFixed(2) + 'px';
            const dy = (Math.random() * 20 - 10).toFixed(2) + 'px';
            const rotation = (Math.random() * 360).toFixed(2) + 'deg';
            const duration = (Math.random() * 120 + 180).toFixed(2) + 's'; // 3–5 min

            shape.style.setProperty('--dx', dx);
            shape.style.setProperty('--dy', dy);
            shape.style.setProperty('--rotation', rotation);
            shape.style.animation = `slow-drift ${duration} linear infinite`;

            container.appendChild(shape);
        }

        console.log(`Generated ${numShapes} shapes with subtle motion.`);
    }

    if (document.getElementById('shape-container')) {
        generateRandomShapes();
        positionGoldCross();
        // --- Optional: move gold cross every 30 sec ---
        setInterval(positionGoldCross, 30000);
    }
});
