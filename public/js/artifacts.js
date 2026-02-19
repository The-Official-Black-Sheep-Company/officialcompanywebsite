window.generateArtifactsReport = async function(targetWeek, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
      console.error('Target container for artifacts report not found.');
      return;
  }
  container.innerHTML = `<p>Loading artifacts report for week ${targetWeek}...</p>`;

  // List of biblical and ancient African artifacts
  const artifacts = [
    "Shroud of Turin", "Dead Sea Scrolls", "Ark of the Covenant",
    "Ethiopian Tabots", "Great Zimbabwe Soapstone Birds",
    "Nok Terracottas", "Benin Bronzes", "King Tutankhamun's Mask",
    "Axum Obelisks", "Rosetta Stone", "Ancient Egyptian Papyrus",
    "Coptic Christian Relics", "Pyramids of Giza Artifacts"
  ];
  window.artifactsList = artifacts; // Expose artifacts list globally

  if (targetWeek < 1 || targetWeek > 52) {
      container.innerHTML = '<p>Invalid week number provided.</p>';
      return;
  }
  const selectedArtifact = artifacts[(targetWeek - 1) % artifacts.length];

  // --- Fetch utilities ---
  async function fetchJSON(url) { try { const res = await fetch(url); return await res.json(); } catch { return null; } }
  async function fetchWikipedia(name) { return fetchJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`); }
  async function fetchWikidata(name) {
    const searchData = await fetchJSON(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&format=json&origin=*`);
    if(!searchData?.search?.length) return null;
    const entityId = searchData.search[0].id;
    const entityData = await fetchJSON(`https://www.wikidata.org/wiki/Special:EntityData/${entityId}.json`);
    return entityData?.entities?.[entityId] || null;
  }
  async function fetchCommonsImages(name, limit=5) {
    const data = await fetchJSON(`https://commons.wikimedia.org/w/api.php?origin=*&action=query&generator=search&gsrsearch=${encodeURIComponent(name)}&gsrlimit=${limit}&prop=imageinfo&iiprop=url&format=json`);
    const pages = data?.query ? Object.values(data.query.pages) : [];
    return pages.map(p => p.imageinfo?.[0]?.url).filter(Boolean);
  }

  async function fetchMuseumArchives(name) {
    const sources = [
      `https://www.loc.gov/collections/?q=${encodeURIComponent(name)}`,
      `https://archive.org/search.php?query=${encodeURIComponent(name)}`,
      `https://www.metmuseum.org/art/collection/search#!?q=${encodeURIComponent(name)}`,
      `https://www.brooklynmuseum.org/opencollection/search?query=${encodeURIComponent(name)}`,
      `https://digitalcollections.nypl.org/search/index?filters%5Btopic%5D%5B%5D=${encodeURIComponent(name)}`,
      `https://www.africanheritagecollection.org/search?query=${encodeURIComponent(name)}`
    ];
    let combinedText = "";
    for(const src of sources) {
      try { const res = await fetch(src); const text = await res.text(); if(text) combinedText += " "+text.replace(/<\/?[^>]+(>|$)/g," "); } catch { continue; }
    }
    return combinedText || null;
  }

  // --- Fetch all content ---
  const [wiki, wikidata, images, extraText] = await Promise.all([
    fetchWikipedia(selectedArtifact),
    fetchWikidata(selectedArtifact),
    fetchCommonsImages(selectedArtifact),
    fetchMuseumArchives(selectedArtifact)
  ]);

  // --- Build narrative ---
  function buildNarrative(wiki, wikidata, extraText) {
    let story = `<p><strong>${selectedArtifact}</strong></p>`;

    // Intro & origin
    if(wiki?.extract) story += `<p>${wiki.extract.split(".")[0]}.</p>`;
    else story += `<p>${selectedArtifact} is a historically significant artifact with remarkable cultural and historical importance.</p>`;

    // History / discovery
    story += `<p>The history and discovery of this artifact are fascinating. `;
    if(extraText) story += extraText.slice(0, 500) + "...</p>";
    else story += "Its origin and the story behind it provide deep insight into the culture and era it comes from.</p>";

    // Cultural / religious significance
    story += `<p>The artifact has profound significance in religious, cultural, or scientific contexts. `;
    if(wiki?.extract) story += wiki.extract.split(".").slice(1,4).join(". ") + ".</p>";
    else story += "It continues to inform, inspire, and educate people around the world today.</p>";

    // Preservation & analysis
    story += `<p>Over time, ${selectedArtifact} has required careful preservation. `;
    if(extraText) story += "Scientists, historians, and institutions have studied it extensively to understand its origin and impact.";
    else story += "Preservation and study of this artifact reveal the dedication to maintaining humanity’s shared history.";
    story += "</p>";

    // Legacy & impact
    story += `<p>The legacy of ${selectedArtifact} is evident today, influencing scholarship, religion, art, and cultural understanding.</p>`;

        return story;

      }

    

      const narrative = buildNarrative(wiki, wikidata, extraText);

      const snippet = wiki?.extract ? wiki.extract.split(".")[0] + "." : `${selectedArtifact} is a historically significant artifact.`;

      const imageUrl = images.length ? images[0] : 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'; // Default image

    

      // --- Render ---

      container.innerHTML = `<h2>${selectedArtifact}</h2>` +

        `<div>${narrative}</div>` +

        (images.length ? `<div>${images.map(url=>`<img src="${url}" style="max-width:200px; margin:5px;">`).join("")}</div>` : "");

    

      return {

          title: selectedArtifact,

          snippet: snippet,

          imageUrl: imageUrl

      };

    }
