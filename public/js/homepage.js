// --- Homepage JS: Background Shapes & Gold Cross ---
document.addEventListener('DOMContentLoaded', () => {

    // Random Bible verse
    async function setRandomBibleVerse() {
        try {
            const response = await fetch('few-verses.txt');
            const text = await response.text();
            const verses = text.split('\n').filter(line => line.trim() !== '');
            const randomVerse = verses.length > 0
                ? verses[Math.floor(Math.random() * verses.length)]
                : "The Lord bless you and keep you. - Numbers 6:24";
            const verseEl = document.getElementById('bible-verse');
            if (verseEl) verseEl.textContent = randomVerse;
        } catch (err) {
            console.error(err);
        }
    }
    setRandomBibleVerse();
    setInterval(setRandomBibleVerse, 30000);

    // --- Slideshow Logic ---
    let slideIndex = 0;
    let slideTimeout;

    function showSlides() {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");
        
        if (!slides.length) return;

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 }
        
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" dot-active", "");
        }
        
        slides[slideIndex - 1].style.display = "block";
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].className += " dot-active";
        }
        
        slideTimeout = setTimeout(showSlides, 5000); // Change image every 5 seconds
    }

    // Manual slide control
    window.currentSlide = (n) => {
        clearTimeout(slideTimeout);
        slideIndex = n - 1;
        showSlides();
    };

    // Initial load
    showSlides();
});
