// Function to generate a random hex color
function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to generate and place randomized shapes
function generateBackgroundShapes() {
    const numShapes = Math.floor(Math.random() * 48) + 3; // Random number between 3 and 50
    const body = document.body;
    const shapes = ['rhombus', 'hexagon', 'pentagon', 'triangle', 'square', 'circle'];

    // Clear any previous shapes
    document.querySelectorAll('.shape').forEach(s => s.remove());

    for (let i = 0; i < numShapes; i++) {
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.floor(Math.random() * 150) + 50; // Random size 50px to 200px
        const top = Math.random() * (window.innerHeight - size);
        const left = Math.random() * (window.innerWidth - size);
        const rotation = Math.random() * 360;

        const shapeDiv = document.createElement('div');
        shapeDiv.classList.add('shape', shapeType);

        shapeDiv.style.width = `${size}px`;
        shapeDiv.style.height = `${size}px`;
        shapeDiv.style.top = `${top}px`;
        shapeDiv.style.left = `${left}px`;
        shapeDiv.style.transform = `rotate(${rotation}deg)`;

        // Specific CSS for shapes using borders/clip-path for complex forms
        if (shapeType === 'triangle') {
            // Triangle uses border trick for simplicity
            shapeDiv.style.width = '0';
            shapeDiv.style.height = '0';
            shapeDiv.style.borderLeft = `${size / 2}px solid transparent`;
            shapeDiv.style.borderRight = `${size / 2}px solid transparent`;
            shapeDiv.style.borderBottom = `${size}px solid var(--dark-gray)`;
            shapeDiv.style.backgroundColor = 'transparent';
        } else if (shapeType === 'hexagon') {
             // Hexagon uses clip-path
            shapeDiv.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        } else if (shapeType === 'rhombus') {
            // Rhombus is just a square rotated 45deg
            shapeDiv.style.transform += ' rotate(45deg)';
        }
        
        // For other shapes (square/pentagon/circle), you'd use clip-path or border-radius
        // For brevity, we'll keep the core styling for this example.

        body.appendChild(shapeDiv);
    }
}

// Function to place the consistent Gold Cross
function placeGoldCross() {
    const cross = document.getElementById('gold-cross');
    const crossSize = 2.5 * 96; // 2.5 inches in pixels (approx 96px/in)
    
    // Position randomly within view, accounting for its size
    const top = Math.random() * (window.innerHeight - crossSize);
    const left = Math.random() * (window.innerWidth - crossSize);

    // Apply the position
    cross.style.top = `${top}px`;
    cross.style.left = `${left}px`;
}

// Function to set initial button state (OFF)
function initializeButtons() {
    const buttons = document.querySelectorAll('.dashboard-button');
    buttons.forEach(button => {
        // Set all buttons to the default OFF state initially
        button.classList.add('off-state');
    });
}

// --- Placeholder Functions for Future Backend Integration ---

// Function to simulate dynamic status change (for testing)
function setButtonStatus(appName, isActive) {
    const button = document.querySelector(`.dashboard-button[data-app-name="${appName}"]`);
    if (!button) return;

    if (isActive) {
        button.classList.remove('off-state');
        const randomColor = getRandomHexColor();
        
        button.style.backgroundColor = randomColor;
        button.style.color = 'white'; // Readable text color for active state
        
        // Green light glow/shadow
        button.style.boxShadow = `var(--active-shadow) #00FF00`; 
        
    } else {
        // OFF State logic
        button.classList.add('off-state');
        button.style.backgroundColor = '';
        button.style.color = '';
        
        // Black shadow
        button.style.boxShadow = `var(--active-shadow) var(--black)`; 
    }
}

// Function to check all service statuses
async function checkAllServices() {
    try {
        const response = await fetch('/check-services.php');
        const data = await response.json();

        if (data.services) {
            // Create a map of port -> active status
            const portStatus = {};
            data.services.forEach(service => {
                portStatus[service.port] = service.active;
            });

            // Update all app buttons
            const buttons = document.querySelectorAll('.app-button[data-port]');
            buttons.forEach(button => {
                const port = button.getAttribute('data-port');
                const appName = button.getAttribute('data-app-name');
                const isActive = portStatus[port] || false;

                if (isActive) {
                    button.classList.remove('off');
                    button.classList.add('on');
                    const randomColor = getRandomHexColor();
                    button.style.backgroundColor = randomColor;
                    button.style.color = 'white';
                    button.style.boxShadow = '0 0 20px #00FF00, 0 0 40px #00FF00';
                } else {
                    button.classList.remove('on');
                    button.classList.add('off');
                    button.style.backgroundColor = '';
                    button.style.color = '';
                    button.style.boxShadow = '0 0 20px #000000';
                }
            });
        }
    } catch (error) {
        console.error('Error checking service status:', error);
    }
}

// Placeholder for the search functionality (Requires backend implementation)
function performSearch() {
    const query = document.getElementById('directory-search').value;
    alert(`Searching for: ${query}. (Backend logic required to search across all server directories)`);
    // NOTE: This function requires a server-side API call to search your directories.
}

// Initialize everything when the page loads
window.onload = () => {
    generateBackgroundShapes();
    placeGoldCross();
    initializeButtons();

    // Check service status immediately
    checkAllServices();

    // Check service status every 10 seconds
    setInterval(checkAllServices, 10000);
};

// Re-run the background generation and placement if the window is resized
window.onresize = () => {
    generateBackgroundShapes();
    placeGoldCross();
};