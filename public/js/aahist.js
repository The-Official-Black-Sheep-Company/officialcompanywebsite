window.generateAahistReport = async function(targetWeek, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
      console.error('Target container for aahist report not found.');
      return;
  }
  container.innerHTML = `<p>Loading African American history report for week ${targetWeek}...</p>`;

  // Full 52-event rotation for African American history
  const events = [
    "Harriet Tubman and the Underground Railroad",
    "Frederick Douglass' Abolitionist Movement",
    "Sojourner Truth's 'Ain't I a Woman?' Speech",
    "The Emancipation Proclamation",
    "W.E.B. Du Bois Founding of NAACP",
    "Booker T. Washington and Tuskegee Institute",
    "Madam C.J. Walker's Entrepreneurship",
    "Ida B. Wells Anti-Lynching Campaign",
    "Harlem Renaissance Artistic Movement",
    "Langston Hughes Poetry Influence",
    "Zora Neale Hurston and African American Literature",
    "The Great Migration (1916–1970)",
    "Marcus Garvey and the UNIA",
    "Rosa Parks and the Montgomery Bus Boycott",
    "Martin Luther King Jr.'s Leadership",
    "Malcolm X and the Nation of Islam",
    "Thurgood Marshall and Brown v. Board of Education",
    "Jackie Robinson Breaking Baseball's Color Barrier",
    "Duke Ellington and Jazz Revolution",
    "Ella Fitzgerald and Music Innovation",
    "Medgar Evers and Civil Rights Activism",
    "Muhammad Ali's Global Influence",
    "Shirley Chisholm and Political Firsts",
    "Bayard Rustin and Nonviolent Strategy",
    "James Baldwin Literary Impact",
    "Angela Davis and Social Justice Activism",
    "Oprah Winfrey Media Leadership",
    "Barack Obama Presidency",
    "Michelle Obama's Advocacy",
    "Serena Williams and Sports Excellence",
    "Katherine Johnson NASA Contributions",
    "Mae Jemison Space Exploration",
    "Neil deGrasse Tyson Science Communication",
    "Langston Hughes Poetry Impact",
    "Toni Morrison Literary Legacy",
    "Wangari Maathai African Activism",
    "Ella Baker and Grassroots Civil Rights",
    "Ruby Bridges and School Integration",
    "Bayard Rustin's March on Washington Role",
    "Fannie Lou Hamer Voting Rights Activism",
    "Medgar Evers Assassination & Legacy",
    "Dorothy Height and Women’s Leadership",
    "Thurgood Marshall Supreme Court Milestone",
    "Colin Powell Military and Political Leadership",
    "Mae Jemison Shuttle Mission",
    "Juneteenth Emancipation Celebration",
    "Harlem Renaissance Visual Arts",
    "Langston Hughes Literary Achievements",
    "African American Inventors and Innovations",
    "African American Scholars and Thinkers",
    "Civil Rights Act of 1964 Impact",
    "Voting Rights Act of 1965 Legacy",
    "Black Lives Matter Movement Origins"
  ];
  window.aahistEvents = events; // Expose events list globally

  if (targetWeek < 1 || targetWeek > 52) {
      container.innerHTML = '<p>Invalid week number provided.</p>';
      return;
  }
  const selectedEvent = events[(targetWeek - 1) % events.length];

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

  async function fetchHBCUArchives(name) {
    const sources = [
      `https://www.loc.gov/collections/?q=${encodeURIComponent(name)}`,
      `https://archive.org/search.php?query=${encodeURIComponent(name)}`,
      `https://www.hbcudigitallibrary.org/search?query=${encodeURIComponent(name)}`,
      `https://digitalcollections.nypl.org/search/index?filters%5Btopic%5D%5B%5D=${encodeURIComponent(name)}`,
      `https://www.africanamericanhistory.org/search?query=${encodeURIComponent(name)}`
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
    fetchHBCUArchives(selectedEvent)
  ]);

  // --- Build narrative ---
  function buildNarrative(wiki, wikidata, extraText) {
    let story = `<p><strong>${selectedEvent}</strong></p>`;

    // Overview
    if(wiki?.extract) story += `<p>${wiki.extract.split(".")[0]}.</p>`;
    else story += `<p>${selectedEvent} is a pivotal moment in African American history with deep cultural and societal significance.</p>`;

    // Context & causes
    story += `<p>The context and causes of this event are rich and multifaceted. `;
    if(extraText) story += extraText.slice(0, 500) + "...</p>";
    else story += "Its background reveals the struggles, resilience, and achievements of the people involved.</p>";

    // Key figures
    story += `<p>Key figures include leaders, activists, scholars, and innovators. `;
    if(wiki?.extract) story += wiki.extract.split(".").slice(1,4).join(". ") + ".</p>";
    else story += "These individuals profoundly influenced the outcome and legacy of the event.</p>";

    // Timeline / major actions
    story += `<p>The timeline demonstrates the sequence and impact of the event. `;
    if(extraText) story += extraText.slice(500, 1000) + "...</p>";
    else story += "Each stage contributed to shaping African American history and society.</p>";

    // Consequences & legacy
    story += `<p>The consequences were profound and enduring. `;
    story += "This event’s legacy continues to shape culture, civil rights, scholarship, and community today.</p>";

        return story;

      }

    

      const narrative = buildNarrative(wiki, wikidata, extraText);

      const snippet = wiki?.extract ? wiki.extract.split(".")[0] + "." : `${selectedEvent} is a pivotal moment in African American history.`;

      const imageUrl = images.length ? images[0] : 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=No+Image'; // Default image

    

      // --- Render ---

      container.innerHTML = `<h2>${selectedEvent}</h2>` +

        `<div>${narrative}</div>` +

        (images.length ? `<div>${images.map(url=>`<img src="${url}" style="max-width:200px; margin:5px;">`).join("")}</div>` : "");

        

      return {

          title: selectedEvent,

          snippet: snippet,

          imageUrl: imageUrl

      };

    }
