async function initializeBibleStudyContent() {
    const container = document.getElementById('bibleStudyContent');
    if (!container) {
        console.error("Bible Study content container not found.");
        return;
    }

    // Check if there's a new study coming soon
    if (false) { 
        container.innerHTML = "<p>Next Biblical Research Study publishes Monday.</p>";
        return;
    }

    // --- Dynamic Media Fetcher ---
    let localImageMap = null;
    try {
        const response = await fetch('/media/bible/genesis/image_map.json');
        if (response.ok) {
            localImageMap = await response.json();
            console.log("Bible Study: Local image map synchronized.");
        }
    } catch (e) {
        console.warn("Bible Study: Local map not found, using predictive pathing.");
    }

    async function fetchImages(query) {
        // Preference 1: Explicit mapping from image_map.json
        if (localImageMap) {
            const keys = {
                "hebrew": "Ancient Hebrew Genesis Manuscript",
                "maps": "Ancient Near East firmament cosmos map",
                "artifact": "Enuma Elish Tablet"
            };
            const mappedPath = localImageMap[keys[query]];
            if (mappedPath) return [mappedPath];
        }

        // Preference 2: Predictive Local Paths
        const localPaths = {
            "hebrew": ["/media/bible/genesis/ancient_hebrew_genesis_manuscript.jpg"],
            "maps": ["/media/bible/genesis/ancient_near_east_firmament_cosmos_map.jpg"],
            "artifact": ["/media/bible/genesis/enuma_elish_tablet.jpg"],
            "familyTree": ["/media/bible/genesis/genesis.png"], // Using existing genesis image as placeholder
            "timeline": ["/media/bible/genesis/placeholder1.jpg"]
        };

        if (localPaths[query]) return localPaths[query];

        // Preference 3: Legacy Cloud Fallback
        const legacyUrls = {
            "hebrew": ["https://upload.wikimedia.org/wikipedia/commons/1/11/Bereshit-manuscript.jpg"],
            "maps": ["https://upload.wikimedia.org/wikipedia/commons/5/5d/Ancient_Near_East_Map.png"]
        };
        return legacyUrls[query] || [];
    }

    const study = {
        title: "Genesis 1 – Week 1: Creation Narrative",
        subtitle: "Deep Dive: Narrative, Hebrew, Context, Prophecy, Maps, Timelines, Family Trees, Artifacts",
        narrative: `
            <p>Genesis 1 presents the creation of the cosmos by a singular sovereign God. 
            The chapter is organized in a seven-day structure: Days 1-3 establish domains, Days 4-6 populate them. 
            Repetition of phrases such as "And God said," "And it was so," and "And God saw that it was good" 
            emphasizes intentional, ordered creation rather than chaos.</p>

            <p>This narrative contrasts with ancient Near Eastern myths where creation arises from cosmic battles. 
            God’s spoken word alone brings forth light, sky, land, vegetation, celestial bodies, animals, and finally humanity.</p>
        `,
        hebrew: `
            <p><strong>Bereshit</strong> (בְּרֵאשִׁית) – “In the beginning.” Contextually, it can mean absolute beginning or starting point of divine ordering.</p>
            <p><strong>Bara</strong> (בָּרָא) – “Created.” Exclusive to divine creation.</p>
            <p><strong>Elohim</strong> (אֱלֹהִים) – Plural noun with singular verbs, emphasizing majesty and sovereignty.</p>
        `,
        context: async () => {
            const mapUrls = await fetchImages("maps");
            const timelineUrls = await fetchImages("timeline");
            return `
                <p>Near Eastern parallels: Enuma Elish, Babylonian creation myth. Genesis removes divine combat, emphasizing order and moral goodness.</p>
                <p>Geography and mapping: Ancient Mesopotamia, Canaan, regions relevant to human settlements.</p>
                ${mapUrls.map(u => `<img class="study-image" src="${u}" alt="Ancient Map">`).join('')}
                <p>Timelines: Days of creation, lifespans, sequence of divine acts.</p>
                ${timelineUrls.map(u => `<img class="study-image" src="${u}" alt="Timeline">`).join('')}
            `;
        },
        prophecy: `
            <p>Humanity in the "image of God" foreshadows covenantal relationships and Christological interpretation in the New Testament.</p>
        `,
        familyTree: async () => {
            const urls = await fetchImages('familyTree');
            return `
                <p>Adam → Eve → Cain, Abel, Seth → generations leading to Noah.</p>
                ${urls.map(u => `<img class="study-image" src="${u}" alt="Family Tree">`).join('')}
            `;
        },
        artifacts: async () => {
            const urls = await fetchImages('artifact');
            return `
                <p>Relevant archaeological finds: Early Mesopotamian tablets, figurines, ancient art depicting creation motifs.</p>
                ${urls.map(u => `<img class="study-image" src="${u}" alt="Artifact">`).join('')}
            `;
        }
    };

    async function createSection(title, content) {
        const div = document.createElement("div");
        div.className = "study-section";
        const h3 = document.createElement("h3");
        h3.textContent = title;
        h3.onclick = () => { contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block"; };
        const contentDiv = document.createElement("div");
        contentDiv.className = "study-content";
        if (typeof content === "function") {
            contentDiv.innerHTML = await content();
        } else {
            contentDiv.innerHTML = content;
        }
        div.appendChild(h3);
        div.appendChild(contentDiv);
        return div;
    }

    container.innerHTML = `<div class="study-header">${study.title}</div><div class="study-sub">${study.subtitle}</div>`;

    const sections = [
        { title: "Narrative Deep Dive", content: study.narrative },
        { title: "Hebrew Word Analysis", content: study.hebrew },
        { title: "Ancient Context & Maps/Timelines", content: study.context },
        { title: "Prophetic & Messianic Threads", content: study.prophecy },
        { title: "Family Tree / Genealogy", content: study.familyTree },
        { title: "Artifacts & Archaeology", content: study.artifacts }
    ];

    for (const sec of sections) {
        container.appendChild(await createSection(sec.title, sec.content));
    }

    // --- COMMENTS LOGIC ---
    const commentForm = document.getElementById("commentForm");
    const commentsList = document.getElementById("commentsList");

    const escapeHtml = (unsafe) => {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };

    const loadComments = () => {
        const comments = JSON.parse(localStorage.getItem("bibleStudyComments") || "[]");
        renderComments(comments);
    };

    const renderComments = (comments) => {
        if (!commentsList) return;
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="text-gray-400 text-center py-8 italic">No insights shared yet. Be the first to start the conversation!</p>';
            return;
        }

        commentsList.innerHTML = comments.map(c => `
            <div class="comment-item bg-gray-50 p-5 rounded-xl border border-gray-100 transition-all hover:border-amber-200">
                <div class="comment-header flex justify-between items-center mb-3">
                    <span class="comment-author font-bold text-gray-800">${escapeHtml(c.name)}</span>
                    <span class="comment-date text-[10px] text-gray-400 uppercase tracking-widest font-mono">${new Date(c.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="comment-text text-sm text-gray-600 leading-relaxed">${escapeHtml(c.text)}</div>
            </div>
        `).join('');
    };

    const saveComment = (name, text) => {
        const comments = JSON.parse(localStorage.getItem("bibleStudyComments") || "[]");
        const newComment = {
            name,
            text,
            date: new Date().toISOString()
        };
        comments.unshift(newComment); // Add to the beginning
        localStorage.setItem("bibleStudyComments", JSON.stringify(comments));
        renderComments(comments);
    };

    if (commentForm) {
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("userName");
            const textInput = document.getElementById("commentText");
            const submitBtn = commentForm.querySelector(".submit-comment-btn");

            if (nameInput.value && textInput.value) {
                // Disable button and show loading state
                const originalBtnText = submitBtn.innerText;
                submitBtn.innerText = "Posting...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    saveComment(nameInput.value, textInput.value);
                    textInput.value = ""; // Clear only comment text
                    
                    // Reset button
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Scroll to comments
                    document.getElementById("commentsDisplay").scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        });
    }

    loadComments();
}

// Global scope for manual toggling if needed
window.toggleSection = function(element) {
    const content = element.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
};

// Auto-initialize if on the right page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bibleStudyContent')) {
        initializeBibleStudyContent();
    }
});
