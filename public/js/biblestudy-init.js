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

    // Placeholder function to simulate fetching images from multiple sources
    async function fetchImages(query) {
        const urls = {
            "hebrew": [
                "https://upload.wikimedia.org/wikipedia/commons/1/11/Bereshit-manuscript.jpg",
                "https://upload.wikimedia.org/wikipedia/commons/f/fc/Dead_Sea_Scroll_-_Genesis1.jpg"
            ],
            "maps": [
                "https://upload.wikimedia.org/wikipedia/commons/5/5d/Ancient_Near_East_Map.png"
            ],
            "timeline": [
                "https://upload.wikimedia.org/wikipedia/commons/a/a0/Creation_timeline_placeholder.png"
            ],
            "familyTree": [
                "https://upload.wikimedia.org/wikipedia/commons/9/9a/Adam_Eve_genealogy.png"
            ],
            "artifact": [
                "https://upload.wikimedia.org/wikipedia/commons/4/4d/Clay_tablet_ancient_mesopotamia.jpg"
            ]
        };
        return urls[query] || [];
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
