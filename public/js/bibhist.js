window.generateBibhistReport = async function(targetWeek, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
      console.error('Target container for bibhist report not found.');
      return;
  }
  container.innerHTML = `<p>Loading biblical history report for week ${targetWeek}...</p>`;

  // List of biblical topics
  const topics = [
    "The Creation story in Genesis",
    "Noah's Ark and the Flood",
    "The Tower of Babel",
    "The story of Abraham and Sarah",
    "The story of Moses and the Exodus",
    "The Ten Commandments",
    "The story of David and Goliath",
    "The wisdom of King Solomon",
    "The story of Job",
    "The prophecy of Isaiah",
    "The life and teachings of Jesus Christ",
    "The Sermon on the Mount",
    "The parables of Jesus",
    "The Last Supper",
    "The crucifixion and resurrection of Jesus",
    "The missionary journeys of Paul the Apostle",
    "The Book of Revelation"
  ];
  window.bibhistTopics = topics; // Expose topics list globally

  if (targetWeek < 1 || targetWeek > 52) {
      container.innerHTML = '<p>Invalid week number provided.</p>';
      return;
  }
  const selectedTopic = topics[(targetWeek - 1) % topics.length];

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

  // --- Fetch all content ---
  const [wiki, wikidata, images] = await Promise.all([
    fetchWikipedia(selectedTopic),
    fetchWikidata(selectedTopic),
    fetchCommonsImages(selectedTopic)
  ]);

  // --- Build narrative ---
  function buildNarrative(wiki, wikidata) {
    let story = `<p><strong>${selectedTopic}</strong></p>`;

    if(wiki?.extract) {
        story += `<p>${wiki.extract}</p>`;
    } else {
        story += `<p>The story of ${selectedTopic} is a foundational element of biblical history, offering timeless lessons on faith, humanity, and divine will.</p>`;
        story += `<p>Exploring its context reveals deep theological insights and its influence across generations. This narrative has been a cornerstone of art, literature, and culture for centuries.</p>`;
    }
    return story;
  }

  const narrative = buildNarrative(wiki, wikidata);
  const snippet = wiki?.extract ? wiki.extract.split(".")[0] + "." : `${selectedTopic} is a foundational element of biblical history.`;
  const imageUrl = images.length ? images[0] : 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'; // Default image

  // --- Render ---
  container.innerHTML = `<h2>${selectedTopic}</h2>` +
    `<div>${narrative}</div>` +
    (images.length ? `<div>${images.map(url=>`<img src="${url}" style="max-width:200px; margin:5px;">`).join("")}</div>` : "");
    
  return {
      title: selectedTopic,
      snippet: snippet,
      imageUrl: imageUrl
  };
}
