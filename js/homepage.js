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

});
