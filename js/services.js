const { useState, useRef, useEffect, useLayoutEffect } = React;

const CleaningButton = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const buttonPositionRef = useRef(null);

    const generateBubbles = (count) => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            type: Math.random() > 0.7 ? 'large' : 'foam',
            size: Math.random() > 0.7 ? Math.random() * 50 + 30 : Math.random() * 20 + 8,
        }));
    };

    const bubbles = useRef(generateBubbles(500));
    const bubbleIndexRef = useRef(0);
    const spawnIntervalRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(textRef.current, { opacity: 0, scale: 0.5, y: 20 });
            gsap.set(".cleaning-foam-particle", {
                opacity: 0,
                scale: 0
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        // Get button position
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            buttonPositionRef.current = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        const ctx = gsap.context(() => {
            if (isHovered) {
                // Reset all bubbles to fresh state
                const particles = gsap.utils.toArray(".cleaning-foam-particle");
                gsap.set(particles, {
                    opacity: 0,
                    scale: 0,
                    left: 0,
                    top: 0
                });

                const tl = gsap.timeline();
                tl.to(textRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.6)"
                });

                const buttonPos = buttonPositionRef.current;
                bubbleIndexRef.current = 0;

                // Function to spawn a single bubble
                function spawnBubble() {
                    const p = particles[bubbleIndexRef.current % particles.length];
                    bubbleIndexRef.current++;

                    // Random explosion direction
                    const angle = Math.random() * Math.PI * 2;
                    const velocity = Math.random() * 300 + 100;
                    const startX = buttonPos.x + Math.cos(angle) * velocity;
                    const startY = buttonPos.y + Math.sin(angle) * velocity - 200;

                    const driftX = Math.random() * 600 - 300;
                    const bottomY = window.innerHeight - Math.random() * 250;

                    // Start at button
                    gsap.set(p, {
                        left: buttonPos.x,
                        top: buttonPos.y,
                        opacity: 0,
                        scale: 0,
                        rotation: 0
                    });

                    const tl = gsap.timeline();

                    // 1. Spawn and explode outward
                    tl.to(p, {
                        duration: 0.3,
                        opacity: Math.random() * 0.3 + 0.7,
                        scale: Math.random() * 0.7 + 0.8,
                        left: startX,
                        top: startY,
                        ease: "power2.out"
                    }, 0);

                    // 2. Fall and drift to bottom
                    tl.to(p, {
                        duration: Math.random() * 2 + 2,
                        left: startX + driftX,
                        top: bottomY,
                        rotation: Math.random() * 720 - 360,
                        ease: "power1.inOut"
                    }, 0.3);

                    // 3. Settle with bounce and STAY AT BOTTOM
                    tl.to(p, {
                        duration: 0.5,
                        scale: Math.random() * 0.3 + 0.9,
                        ease: "bounce.out"
                    }, "-=0.5");
                }

                // Continuously spawn bubbles while hovering
                spawnIntervalRef.current = setInterval(() => {
                    if (isHovered) {
                        spawnBubble();
                        spawnBubble(); // Spawn 2 at a time for more intensity
                    }
                }, 100); // Every 100ms = 20 bubbles per second

                // Spawn initial burst
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => spawnBubble(), i * 50);
                }

            } else {
                // Stop spawning new bubbles
                if (spawnIntervalRef.current) {
                    clearInterval(spawnIntervalRef.current);
                    spawnIntervalRef.current = null;
                }

                // Hide the text immediately
                gsap.killTweensOf(textRef.current);
                gsap.set(textRef.current, { opacity: 0, scale: 0.5, y: 20 });

                // DON'T kill bubble animations - let them finish falling
                // Wait for bubbles to settle, then pop them
                setTimeout(() => {
                    const particles = gsap.utils.toArray(".cleaning-foam-particle");

                    // Pop effect - bubbles burst and disappear
                    particles.forEach((p, i) => {
                        gsap.to(p, {
                            scale: 0,
                            opacity: 0,
                            duration: 0.3,
                            delay: i * 0.005,
                            ease: "back.in(2)"
                        });
                    });
                }, 5000); // Wait 5 seconds for all bubbles to settle
            }
        }, containerRef);

        return () => ctx.revert();
    }, [isHovered]);

    return (
        React.createElement('div', {
            ref: containerRef,
            className: "relative w-[600px] h-[120px] cursor-pointer group select-none",
            onMouseEnter: () => setIsHovered(true),
            onMouseLeave: () => setIsHovered(false),
            style: { fontFamily: 'Poppins, sans-serif' }
        },
            React.createElement('div', {
                className: `absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 z-0 overflow-hidden transform transition-all duration-300 group-active:scale-95 border-4 border-white/20 ${isHovered ? 'shadow-[0_0_60px_rgba(59,130,246,0.9),0_0_100px_rgba(59,130,246,0.6)]' : 'shadow-none'}`
            },
                React.createElement('div', {
                    className: `absolute inset-0 bg-white/30 skew-x-12 blur-xl transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`
                })
            ),
            React.createElement('div', {
                className: "pointer-events-none"
            },
                bubbles.current.map((b) =>
                    React.createElement('div', {
                        key: b.id,
                        className: "cleaning-foam-particle foam-particle",
                        style: {
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            background: b.type === 'large'
                                ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))'
                                : 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            boxShadow: b.type === 'large' ? 'inset 0 0 15px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.6)' : '0 0 4px rgba(255,255,255,0.8)',
                            backdropFilter: b.type === 'large' ? 'blur(2px)' : 'blur(1px)',
                            border: b.type === 'large' ? '2px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.5)'
                        }
                    })
                )
            ),
            React.createElement('div', {
                ref: textRef,
                className: "absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
            },
                React.createElement('h1', {
                    className: "cleaning-text-outline text-2xl md:text-3xl font-extrabold text-white tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] text-center leading-tight",
                    style: { textShadow: '0 0 15px rgba(255,255,255,0.6)' }
                },
                    React.createElement('span', null, 'Commercial & Residential'),
                    React.createElement('br'),
                    React.createElement('span', null, 'Cleaning Services')
                )
            )
        )
    );
};

// Wait for DOM to be ready and React to be loaded
if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    const cleaningRoot = document.getElementById('cleaning-button-root');
    if (cleaningRoot) {
        const root = ReactDOM.createRoot(cleaningRoot);
        root.render(React.createElement(CleaningButton));
    }
}
