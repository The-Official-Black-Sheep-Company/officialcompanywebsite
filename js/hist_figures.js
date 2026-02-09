window.generateHistFiguresReport = async function(targetWeek, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
      console.error('Target container for hist_figures report not found.');
      return;
  }
  container.innerHTML = `<p>Loading historical figures report for week ${targetWeek}...</p>`;

  const figures = [
    "Harriet Tubman", "Martin Luther King Jr.", "George Washington Carver",
    "Katherine Johnson", "Nelson Mandela", "Maya Angelou",
    "Wangari Maathai", "Frederick Douglass", "Malcolm X", "W.E.B. Du Bois",
    "Chinua Achebe", "Ida B. Wells", "Sojourner Truth", "Fela Kuti",
    "Patricia Bath", "Mae Jemison", "Marian Anderson", "Toussaint Louverture",
    "Kwame Nkrumah", "Fannie Lou Hamer"
  ];
  window.histFiguresList = figures; // Expose figures list globally

  if (targetWeek < 1 || targetWeek > 52) {
      container.innerHTML = '<p>Invalid week number provided.</p>';
      return;
  }
  const selectedFigure = figures[(targetWeek - 1) % figures.length];

  // --- Fetch utilities ---
  async function fetchJSON(url) {
    try { const res = await fetch(url); return await res.json(); } catch { return null; }
  }

  async function fetchWikipedia(name) {
    return fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
  }

  async function fetchWikidata(name) {
    const searchData = await fetchJSON(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&format=json&origin=*`);
    if (!searchData?.search?.length) return null;
    const entityId = searchData.search[0].id;
    const entityData = await fetchJSON(`https://www.wikidata.org/wiki/Special:EntityData/${entityId}.json`);
    return entityData?.entities?.[entityId] || null;
  }

  async function fetchCommonsImages(name, limit=5) {
    const data = await fetchJSON(`https://commons.wikimedia.org/w/api.php?origin=*&action=query&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=${limit}&prop=imageinfo&iiprop=url&format=json`);
    const pages = data?.query ? Object.values(data.query.pages) : [];
    return pages.map(p => p.imageinfo?.[0]?.url).filter(Boolean);
  }

  async function fetchAfricanAmericanArchives(name) {
    // Example HBCU & African American sources
    const sources = [
      `https://digitalcommons.hbculibraries.org/cgi/search/simple?q=${encodeURIComponent(name)}`,
      `https://www.loc.gov/collections/african-american-perspectives-and-experiences/?q=${encodeURIComponent(name)}`,
      `https://www.africanamericanhistorymonth.gov/search/?q=${encodeURIComponent(name)}`,
      `https://archive.org/search.php?query=${encodeURIComponent(name)}`
    ];

    let combinedText = "";
    for (const src of sources) {
      try {
        const res = await fetch(src);
        const text = await res.text();
        if (text) combinedText += " " + text.replace(/<\/?[^>]+(>|$)/g, " "); // remove HTML tags
      } catch { continue; }
    }

    return combinedText || null;
  }

  // --- Fetch all content ---
  const [wiki, wikidata, images, extraText] = await Promise.all([
    fetchWikipedia(selectedFigure),
    fetchWikidata(selectedFigure),
    fetchCommonsImages(selectedFigure),
    fetchAfricanAmericanArchives(selectedFigure)
  ]);

  // --- Build narrative ---
  function buildNarrative(wiki, wikidata, extraText) {
    let story = `<p><strong>${selectedFigure}</strong></p>`;

    // Intro & lifespan
    if(wiki?.extract) story += `<p>${wiki.extract.split(".")[0]}.</p>`;
    else story += `<p>${selectedFigure} made a remarkable impact on history.</p>`;

    // Childhood / early life
    story += `<p>Their early life shaped their path. `;
    if(extraText) story += extraText.slice(0, 500) + "...</p>";
    else story += "They grew up in circumstances that fueled their determination.</p>";

    // Education / training
    story += `<p>Education and mentorship played a key role. `;
    if(wikidata?.claims?.P69) story += "They attended influential schools and received guidance that fostered their talents.";
    else story += "Through dedication and curiosity, they learned from every opportunity around them.";
    story += "</p>";

    // Major achievements
    story += `<p>${selectedFigure} accomplished extraordinary things that changed lives. `;
    if(wiki?.extract) story += wiki.extract.split(".").slice(1,4).join(". ") + ".</p>";
    else story += "Their work, activism, or discoveries left a lasting legacy that continues to inspire today.</p>";

    // Challenges overcome
    story += `<p>Challenges did not stop them. `;
    if(extraText) story += "They faced societal barriers, systemic oppression, and personal hardships, yet persevered with strength.";
    else story += "Despite obstacles, they demonstrated resilience and courage.";
    story += "</p>";

    // Legacy & impact
    story += `<p>The impact of ${selectedFigure} is evident today, influencing generations and shaping culture, society, and knowledge worldwide.</p>`;

        return story;

      }

    

      const narrative = buildNarrative(wiki, wikidata, extraText);

      const snippet = wiki?.extract ? wiki.extract.split(".")[0] + "." : `${selectedFigure} made a remarkable impact on history.`;

      const imageUrl = images.length ? images[0] : 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'; // Default image

    

      // --- Render ---

      container.innerHTML = `<h2>${selectedFigure}</h2>` +

        `<div>${narrative}</div>` +

        (images.length ? `<div>${images.map(url=>`<img src="${url}" style="max-width:200px; margin:5px;">`).join("")}</div>` : "");

    

      return {

          title: selectedFigure,

          snippet: snippet,

          imageUrl: imageUrl

      };

    }
