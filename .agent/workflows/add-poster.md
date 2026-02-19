---
description: How to add posters to the homepage slideshow
---

### 1. Place Images
Move your images into the following folder:
`c:\Users\Georg\Projects\blackshepherddeveloper-project\public\media\bible\genesis\`

Recommended format: `.png` or `.jpg`.

### 2. Add Code to `index.html`
Open `public/index.html` and find the `<!-- HERO SLIDESHOW SECTION -->`.

Add this block inside the `slideshow-container` for each new poster:
```html
<div class="slide fade">
    <img src="media/bible/genesis/YOUR_POSTER_FILENAME.png" alt="Poster Description">
    <div class="slide-text">
        <h3>Post Title Here</h3>
        <p>Description goes here.</p>
    </div>
</div>
```

### 3. Add Navigation Dot
Scroll down to the `<div class="slide-dots">` and add a new dot:
```html
<span class="dot" onclick="currentSlide(4)"></span>
```
*Note: If you already have 3 slides, the new one will be number 4.*
