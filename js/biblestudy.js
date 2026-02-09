// biblestudy.js
(async function() {
  // Ensure container exists
  let container = document.getElementById("biblical-study");
  if (!container) {
    container = document.createElement("div");
    container.id = "biblical-study";
    document.body.appendChild(container);
  }

  // Inject CSS dynamically
  const style = document.createElement("style");
  style.textContent = `
    .study-section { margin-bottom: 25px; }
    .study-section h3 { cursor: pointer; color: #2c3e50; margin-bottom: 5px; }
    .study-content { display: none; padding: 10px; border-left: 3px solid #444; }
    .study-header { font-size: 28px; margin-bottom: 10px; color: #1a1a1a; }
    .study-sub { font-size: 18px; margin-bottom: 20px; color: #555; }
    .study-image { max-width: 100%; margin: 10px 0; display: block; }
  `;
  document.head.appendChild(style);

  // Day-of-week logic: 0=Sunday, 1=Monday, etc.
  const today = new Date();
  const dayOfWeek = today.getDay();
  if (dayOfWeek !== 1) { // Monday for weekly biblical study
    container.innerHTML = "<p>Next Biblical Research Study publishes Monday.</p>";
    return;
  }

  // Helper function to create expandable sections
  async function createSection(title, content) {
    const div = document.createElement("div");
    div.className = "study-section";
    const h3 = document.createElement("h3");
    h3.textContent = title;
    const contentDiv = document.createElement("div");
    contentDiv.className = "study-content";
    if (typeof content === "function") {
      contentDiv.innerHTML = await content();
    } else {
      contentDiv.innerHTML = content;
    }
    h3.onclick = () => {
      contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block";
    };
    div.appendChild(h3);
    div.appendChild(contentDiv);
    return div;
  }

  // Image fetching helper (mock URLs for demo; can expand scraping later)
  async function fetchImages(query) {
    const urls = {
      "genesis": ["https://upload.wikimedia.org/wikipedia/commons/3/33/Genesis_manuscript.jpg"],
      "proverbs": ["https://upload.wikimedia.org/wikipedia/commons/1/15/Proverbs_manuscript.jpg"],
      "matthew": ["https://upload.wikimedia.org/wikipedia/commons/8/80/Matthew_manuscript.jpg"],
      "revelation": ["https://upload.wikimedia.org/wikipedia/commons/f/f3/Revelation_Manuscript.jpg"],
      "maps": ["https://upload.wikimedia.org/wikipedia/commons/5/5d/Ancient_Near_East_Map.png"],
      "timeline": ["https://upload.wikimedia.org/wikipedia/commons/a/a0/Creation_timeline_placeholder.png"],
      "familytree": ["https://upload.wikimedia.org/wikipedia/commons/2/2e/Jesus_genealogy_chart.png"]
    };
    return urls[query] || [];
  }

  // All study chapters
  const studies = [
    {
      title: "Genesis 1 – Week 1: Creation & Beginnings",
      subtitle: "Deep Dive: Narrative, Hebrew, Context, Prophecy, Maps, Timelines, Family Trees, Artifacts",
      narrative: `
        <p>Genesis 1 introduces the creation story: God creating the heavens and the earth, light and darkness, 
        land, sea, plants, animals, and humans in six days. The narrative establishes order from chaos, 
        divine authority, and the foundational moral and spiritual principles of humanity.</p>
      `,
      hebrew: `
        <p><strong>Bereshit</strong> (בְּרֵאשִׁית) – "In the beginning", first word of Torah.</p>
        <p><strong>Yom</strong> (יוֹם) – day, period of creation.</p>
      `,
      context: async () => {
        const maps = await fetchImages("maps");
        const timelines = await fetchImages("timeline");
        const genesisImages = await fetchImages("genesis");
        return `
          <p>Historical context: Written in early Israelite culture; creation accounts reflect Hebrew cosmology.</p>
          ${maps.map(u => `<img class="study-image" src="${u}" alt="Ancient Map">`).join('')}
          ${timelines.map(u => `<img class="study-image" src="${u}" alt="Timeline">`).join('')}
          ${genesisImages.map(u => `<img class="study-image" src="${u}" alt="Genesis Manuscript">`).join('')}
        `;
      },
      prophecy: `
        <p>Foreshadows God’s ongoing relationship with humanity; hints of Messiah through lineage later revealed.</p>
      `,
      familyTree: `
        <p>Adam → Seth → Noah → Abraham</p>
      `,
      artifacts: `
        <p>Ancient Hebrew manuscripts, clay tablets, early scroll fragments.</p>
      `
    },
    {
      title: "Proverbs 1 – Week 1: Wisdom & Fear of the Lord",
      subtitle: "Deep Dive: Narrative, Hebrew, Context, Prophecy, Maps, Timelines, Artifacts",
      narrative: `
        <p>Proverbs 1 introduces the purpose of wisdom: to teach prudence, discipline, and moral insight. 
        Solomon’s authorship, the historical setting of Israel’s monarchy, and the literary style of parallelism 
        are key to understanding the text. Wisdom is personified as a woman calling out in the streets, 
        offering life to those who listen and warning of destruction for those who ignore her.</p>
      `,
      hebrew: `
        <p><strong>Chokmah</strong> (חָכְמָה) – wisdom, skill, insight; central theme.</p>
        <p><strong>Yirat Yahweh</strong> (יִרְאַת יְהוָה) – fear of the Lord; beginning of knowledge.</p>
      `,
      context: async () => {
        const maps = await fetchImages("maps");
        const timelines = await fetchImages("timeline");
        const images = await fetchImages("proverbs");
        return `
          <p>Historical context: Israel during Solomon’s reign; compilation of proverbs from different sages.</p>
          ${maps.map(u => `<img class="study-image" src="${u}" alt="Ancient Map">`).join('')}
          ${timelines.map(u => `<img class="study-image" src="${u}" alt="Timeline">`).join('')}
          ${images.map(u => `<img class="study-image" src="${u}" alt="Proverbs Manuscript">`).join('')}
        `;
      },
      prophecy: `
        <p>Foreshadows Christ as the ultimate wisdom and teacher.</p>
      `,
      familyTree: `<p>Not applicable.</p>`,
      artifacts: `<p>Ancient Hebrew manuscripts and inscriptions.</p>`
    },
    {
      title: "Matthew 1 – Week 1: Genealogy and Birth of Christ",
      subtitle: "Deep Dive: Narrative, Greek, Context, Prophecy, Maps, Timelines, Family Trees, Artifacts",
      narrative: `
        <p>Matthew 1 details Jesus’ genealogy, establishing his lineage from Abraham through David. 
        Establishes messianic credentials and fulfillment of Old Testament prophecies. Joseph and Mary’s story emphasizes divine guidance.</p>
      `,
      hebrew: `
        <p><strong>Christos</strong> (Χριστός) – the anointed one, Messiah.</p>
        <p><strong>Logos</strong> (Λόγος) – divine word, connection to God.</p>
      `,
      context: async () => {
        const maps = await fetchImages("maps");
        const images = await fetchImages("matthew");
        return `
          <p>Historical context: Roman-occupied Judea, Jewish expectation of Messiah, genealogical significance.</p>
          ${maps.map(u => `<img class="study-image" src="${u}" alt="Ancient Map">`).join('')}
          ${images.map(u => `<img class="study-image" src="${u}" alt="Matthew Manuscript">`).join('')}
        `;
      },
      prophecy: `<p>Fulfillment of Isaiah 7:14 (“Virgin shall conceive”).</p>`,
      familyTree: `
        <p>Abraham → Isaac → Jacob → David → Solomon → Joseph → Jesus</p>
        <img class="study-image" src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Jesus_genealogy_chart.png" alt="Genealogy">
      `,
      artifacts: `<p>Ancient scrolls, early Christian manuscripts, Nativity artifacts.</p>`
    },
    {
      title: "Revelation 1 – Week 1: Vision of the Son of Man",
      subtitle: "Deep Dive: Narrative, Greek, Context, Prophecy, Maps, Timelines, Artifacts",
      narrative: `
        <p>Revelation 1 introduces John’s vision of Christ glorified. Vivid symbolic imagery describes Jesus among the lampstands, holding the seven stars and a sword-like voice. Sets the stage for apocalyptic visions.</p>
      `,
      hebrew: `
        <p><strong>Apokalypsis</strong> (Αποκάλυψις) – unveiling, revelation.</p>
        <p><strong>Alpha & Omega</strong> – God as beginning and end.</p>
      `,
      context: async () => {
        const images = await fetchImages("revelation");
        return `
          <p>Historical context: Roman persecution of Christians, first-century Asia Minor, Jewish apocalyptic tradition.</p>
          ${images.map(u => `<img class="study-image" src="${u}" alt="Revelation Manuscript">`).join('')}
        `;
      },
      prophecy: `<p>Foreshadows end-time events, messianic reign, ultimate victory over evil.</p>`,
      familyTree: `<p>Not applicable; symbolic vision.</p>`,
      artifacts: `<p>Ancient manuscripts, codices, early Christian iconography.</p>`
    }
  ];

  // Render studies
  for (const study of studies) {
    const header = document.createElement("div");
    header.className = "study-header";
    header.textContent = study.title;
    const sub = document.createElement("div");
    sub.className = "study-sub";
    sub.textContent = study.subtitle;
    container.appendChild(header);
    container.appendChild(sub);

    const sections = [
      { title: "Narrative Deep Dive", content: study.narrative },
      { title: "Word Analysis", content: study.hebrew },
      { title: "Context, Maps, Timelines", content: study.context },
      { title: "Prophetic & Messianic Threads", content: study.prophecy },
      { title: "Family Tree / Genealogy", content: study.familyTree },
      { title: "Artifacts & Archaeology", content: study.artifacts }
    ];

    for (const sec of sections) {
      container.appendChild(await createSection(sec.title, sec.content));
    }
  }

})();
