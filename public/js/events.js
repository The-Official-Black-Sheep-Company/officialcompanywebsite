<div id="historical-event"></div>

<script>
(async function() {
  const container = document.getElementById('historical-event');

  // Manual override: leave null for automatic Monday selection
  const manualEvent = null; // e.g., "Exodus from Egypt"

  // Full 52-event rotation
  const events = [
    "Exodus from Egypt",
    "Crossing of the Red Sea",
    "Battle of Jericho",
    "David and Goliath",
    "King Solomon’s Temple Construction",
    "The Babylonian Captivity",
    "Return from Exile under Cyrus the Great",
    "Building of the Pyramids of Giza",
    "Construction of the Great Sphinx",
    "Tutankhamun’s Tomb Discovery",
    "Reign of Pharaoh Akhenaten",
    "Fall of the Western Roman Empire",
    "Destruction of the Second Temple in Jerusalem",
    "Dead Sea Scrolls Discovery",
    "Siege of Jerusalem by the Romans",
    "Rise of the Axumite Empire",
    "Building of the Obelisks of Axum",
    "Queen of Sheba’s Visit to Solomon",
    "Establishment of Carthage",
    "Hannibal Crossing the Alps",
    "Battle of Zama (Carthage vs Rome)",
    "Rise of the Nok Civilization",
    "Creation of Nok Terracotta Sculptures",
    "Great Zimbabwe Civilization Peak",
    "Crafting of Great Zimbabwe Soapstone Birds",
    "Egyptian Papyrus Innovations",
    "Construction of the Karnak Temple Complex",
    "Reign of Hatshepsut, Queen Pharaoh",
    "Exodus of the Israelites from Egypt (Biblical Timeline)",
    "The Flood Narrative and Ark Traditions",
    "Early Coptic Christian Artifacts",
    "Ethiopian Church Tabots Creation",
    "The Rosetta Stone Discovery",
    "Library of Alexandria Establishment",
    "Fall of the Library of Alexandria",
    "Ancient Egyptian Book of the Dead Compilation",
    "Rise of Kushite Kingdoms",
    "Nubian Pyramids Construction",
    "Meroë Ironworking Civilization",
    "Phoenician Trade Expansion",
    "Siege of Tyre by Alexander the Great",
    "Alexander the Great’s Egyptian Campaign",
    "Establishment of Ptolemaic Egypt",
    "Reign of Cleopatra VII",
    "Roman Conquest of Egypt",
    "Jewish Revolt against Rome (66–73 CE)",
    "Early Christian Spread in Roman Africa",
    "Veneration of Relics in Early Christianity",
    "Ethiopian Solomonic Dynasty Establishment",
    "Discovery of the Ark of the Covenant (Legends & Traditions)",
    "Burial Practices of Ancient Nubia",
    "Ancient African Gold Trade Networks"
  ];

  // Weekly Monday selection
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday
  if(dayOfWeek !== 1) { 
    container.innerHTML = "<p>Next historical event publishes Monday.</p>"; 
    return; 
  }

  const startOfYear = new Date(today.getFullYear(),0,1);
  const weekNumber = Math.floor((today - startOfYear) / (7*24*60*60*1000));
  const selectedEvent = manualEvent || events[weekNumber % events.length];

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
    fetchWikipedia(selectedEvent),
    fetchWikidata(selectedEvent),
    fetchCommonsImages(selectedEvent),
    fetchMuseumArchives(selectedEvent)
  ]);

  // --- Build narrative ---
  function buildNarrative(wiki, wikidata, extraText) {
    let story = `<p><strong>${selectedEvent}</strong></p>`;

    // Overview
    if(wiki?.extract) story += `<p>${wiki.extract.split(".")[0]}.</p>`;
    else story += `<p>${selectedEvent} is a significant historical event with deep cultural and historical importance.</p>`;

    // Context & causes
    story += `<p>The context and causes of this event are rich and multifaceted. `;
    if(extraText) story += extraText.slice(0, 500) + "...</p>";
    else story += "Its background provides insight into the politics, culture, and beliefs of its time.</p>";

    // Key figures
    story += `<p>Key figures involved include leaders, prophets, and influential individuals. `;
    if(wiki?.extract) story += wiki.extract.split(".").slice(1,4).join(". ") + ".</p>";
    else story += "These individuals shaped the outcome and significance of the event.</p>";

    // Timeline / major actions
    story += `<p>The timeline of actions demonstrates the sequence and impact of the event. `;
    if(extraText) story += extraText.slice(500, 1000) + "...</p>";
    else story += "Each stage of the event contributed to its historical legacy.</p>";

    // Consequences & legacy
    story += `<p>The consequences of ${selectedEvent} were profound. `;
    story += "Its legacy continues to influence culture, religion, scholarship, and understanding of the ancient world.</p>";

    return story;
  }

  const narrative = buildNarrative(wiki, wikidata, extraText);

  // --- Render ---
  container.innerHTML = `<h2>${selectedEvent}</h2>` +
    `<div>${narrative}</div>` +
    (images.length ? `<div>${images.map(url=>`<img src="${url}" style="max-width:200px; margin:5px;">`).join("")}</div>` : "");

})();
</script>
