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
      `,
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("biblical-study");

  container.innerHTML = `
    <h2 class="study-header">Genesis 1 – The Foundation of Everything</h2>

    <div class="study-section">
      <h3>Historical Context</h3>
      <p>
        Genesis, called <em>Bereshit</em> (בְּרֵאשִׁית) in Hebrew, was written in a world surrounded by
        competing creation myths. Unlike pagan accounts filled with warring gods, Genesis presents
        a single, sovereign Creator who brings order intentionally and purposefully.
      </p>
      <p>
        The text was preserved by the Hebrew people, transmitted orally before being written,
        and carefully copied by scribes for centuries. This chapter is not poetry first,
        but theology first. It explains who God is before it explains what He does.
      </p>
    </div>

    <div class="study-section">
      <h3>Genesis 1:1 – Hebrew Breakdown</h3>
      <p><strong>Hebrew:</strong> בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ</p>
      <p><strong>Transliteration:</strong> Bereshit bara Elohim et hashamayim ve’et ha’aretz</p>

      <p>
        <strong>Bereshit</strong> – “In the beginning.” This does not mean “at a beginning” but
        <em>the</em> beginning. Time itself starts here. There is no “before” Genesis 1:1.
      </p>

      <p>
        <strong>Bara</strong> – “Created.” This verb is only used in Scripture with God as the subject.
        It implies creation from nothing, not reshaping existing material.
      </p>

      <p>
        <strong>Elohim</strong> – A grammatically plural noun used with a singular verb.
        This is not accidental. It presents complexity within unity.
        This plurality becomes the theological foundation later understood as the Godhead.
      </p>

      <p>
        <strong>The heavens and the earth</strong> – Both are plural in Hebrew.
        This includes all spiritual realms and all physical realms.
        Nothing is excluded. Seen and unseen reality begins here.
      </p>
    </div>

    <div class="study-section">
      <h3>The First Messianic Reference</h3>
      <p>
        Christian theology identifies Genesis 1:1 as the first implicit reference to Jesus Christ.
        The New Testament confirms this in John 1:1–3:
        “All things were made through Him, and without Him nothing was made that was made.”
      </p>
      <p>
        The plural form of <em>Elohim</em> combined with creative authority aligns with Christ
        as the divine Word present at creation. This is not a later invention.
        It is a theological thread woven from the first sentence of Scripture.
      </p>
    </div>

    <div class="study-section">
      <h3>Genesis 1:2 – Chaos Before Order</h3>
      <p>
        The earth is described as formless and void, covered in darkness.
        This does not indicate evil but unformed potential.
        God’s Spirit hovers, ready to bring structure and purpose.
      </p>
      <p>
        This verse establishes a recurring biblical pattern:
        God brings order out of chaos, light out of darkness, and life out of emptiness.
      </p>
    </div>

    <div class="study-section">
      <h3>The Six Days of Creation</h3>
      <p>
        Each day introduces intentional design:
      </p>
      <ul>
        <li>Day 1: Light separated from darkness</li>
        <li>Day 2: Sky separated from waters</li>
        <li>Day 3: Land, seas, vegetation</li>
        <li>Day 4: Sun, moon, stars for signs and seasons</li>
        <li>Day 5: Sea creatures and birds</li>
        <li>Day 6: Animals and humanity</li>
      </ul>
      <p>
        Creation progresses from environments to inhabitants.
        Nothing is random. Everything has purpose.
      </p>
    </div>

    <div class="study-section">
      <h3>Creation of Humanity</h3>
      <p>
        Humanity is created in the image of God.
        This grants intrinsic value, moral responsibility, and creative capacity.
        Humans are given stewardship, not ownership, over creation.
      </p>
      <p>
        The plural language returns: “Let us make man in our image.”
        Again, unity with complexity.
      </p>
    </div>

    <div class="study-section">
      <h3>Theological Themes</h3>
      <ul>
        <li>God is eternal and self-existent</li>
        <li>Creation is intentional and ordered</li>
        <li>Human life has divine purpose</li>
        <li>Jesus Christ is present from the beginning</li>
      </ul>
    </div>

    <div class="study-section">
      <h3>Why Genesis 1 Matters Today</h3>
      <p>
        Genesis 1 answers the biggest human questions:
        Who are we? Why are we here? Where did everything come from?
        Every later biblical doctrine builds on this foundation.
      </p>
    </div>
  `;
});
    },
const genesisWeek1 = {
  week: 1,
  chapter: 1,
  title: "Genesis 1 – The Creation of Heaven and Earth",
  overview: `
    Genesis 1:1 marks the beginning of everything. This chapter establishes the creation narrative,
    the order of the cosmos, and the first mention of God’s plural form, foreshadowing
    Messianic prophecy. The following lessons break down every aspect of the first verse and chapter.
  `,
  verses: [
    {
      verse: "1:1",
      text: "In the beginning God created the heavens and the earth.",
      hebrew: {
        original: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
        transliteration: "Bereshit bara Elohim et hashamayim ve'et ha'aretz",
        translationNotes: `
          "Elohim" is plural, emphasizing majesty and foreshadowing Jesus Christ.
          "Bara" denotes creation ex nihilo (from nothing), a verb reserved for divine acts.
          "The heavens and the earth" refers to all creation, establishing the cosmos' framework.
        `
      },
      theology: `
        Establishes the concept of creation from nothing.
        Introduces God as the ultimate authority and planner.
        First implicit mention of the Messiah in the plural form "Elohim".
      `,
      cosmology: `
        Contrasts with Ancient Near East creation myths (Babylonian, Sumerian).
        "Heavens" can be understood as the sky, firmament, and cosmos.
        "Earth" represents the primordial chaotic substance.
      `,
      chronology: `
        Symbolic beginning of time.
        Connects to later genealogies and creation timelines.
        No specific historical date; theological framework guides interpretation.
      `,
      symbolism: `
        Separation of heaven and earth foreshadows order from chaos.
        Light and darkness will be introduced shortly, emphasizing divine authority.
      `,
      messianicForeshadowing: `
        "Elohim" plural form hints at the Trinity and first subtle reference to Christ.
        Jesus as the Logos (Word) in John 1:1 ties directly to creation.
      `,
      artifacts: `
        - [Placeholder] Torah scroll fragment for Genesis 1:1
        - [Placeholder] Dead Sea Scroll fragment
        - [Placeholder] Ancient Near East creation illustrations
      `,
      maps: `
        [Placeholder] Map of the Ancient Near East showing regions contemporary with Genesis narratives
      `,
      applications: `
        Philosophical: "Why there is something rather than nothing."
        Spiritual: Observing divine order in creation as a template for human life.
        Ethical: Stewardship of creation.
      `,
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder1.jpg" alt="Torah Scroll Genesis 1">
          <img src="/media/bible/genesis/placeholder2.jpg" alt="Ancient Near East Map">
          <img src="/media/bible/genesis/placeholder3.jpg" alt="Creation Illustration">
        </div>
      `
    },
    // You can add 1:2, 1:3, etc., as additional objects in this array for daily verse highlights
  ]
};

// Example function to render the study in HTML
function renderStudy(studyObject) {
  const container = document.getElementById("bible-study-container");
  let html = `
    <h2>${studyObject.title}</h2>
    <p>${studyObject.overview}</p>
  `;
  studyObject.verses.forEach(v => {
    html += `
      <div class="verse-section">
        <h3>Verse ${v.verse}</h3>
        <p>${v.text}</p>
        <h4>Hebrew</h4>
        <p>${v.hebrew.original} (${v.hebrew.transliteration})</p>
        <p>${v.hebrew.translationNotes}</p>
        <h4>Theology</h4>
        <p>${v.theology}</p>
        <h4>Cosmology</h4>
        <p>${v.cosmology}</p>
        <h4>Chronology</h4>
        <p>${v.chronology}</p>
        <h4>Symbolism</h4>
        <p>${v.symbolism}</p>
        <h4>Messianic Foreshadowing</h4>
        <p>${v.messianicForeshadowing}</p>
        <h4>Artifacts</h4>
        <p>${v.artifacts}</p>
        <h4>Maps</h4>
        <p>${v.maps}</p>
        <h4>Applications</h4>
        <p>${v.applications}</p>
        ${v.images}
      </div>
      <hr>
    `;
  });
  container.innerHTML = html;
}
const genesisWeek1 = {
  week: 1,
  chapter: 1,
  title: "Genesis 1 – The Creation of Heaven and Earth",
  overview: `
    Genesis 1 introduces the creation narrative, establishing God as the ultimate creator,
    the order of the cosmos, and the first mention of Jesus Christ in the plural form "Elohim."
    This study covers the first three verses in depth.
  `,
  verses: [
    {
      verse: "1:1",
      text: "In the beginning God created the heavens and the earth.",
      hebrew: {
        original: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
        transliteration: "Bereshit bara Elohim et hashamayim ve'et ha'aretz",
        translationNotes: `
          "Elohim" is plural, emphasizing majesty and foreshadowing Jesus Christ.
          "Bara" denotes creation ex nihilo (from nothing), a verb reserved for divine acts.
          "The heavens and the earth" refers to all creation, establishing the cosmos' framework.
        `
      },
      theology: "Creation ex nihilo; first implicit mention of the Messiah; God as ultimate planner.",
      cosmology: "Contrasts with Ancient Near East creation myths; heavens = cosmos; earth = chaotic substance.",
      chronology: "Symbolic beginning of time; theological framework guides interpretation.",
      symbolism: "Separation of heaven and earth foreshadows order from chaos.",
      messianicForeshadowing: "Plural 'Elohim' hints at Trinity; first subtle reference to Christ.",
      artifacts: "[Placeholder] Torah scroll fragment; Dead Sea Scroll fragment; Ancient illustrations.",
      maps: "[Placeholder] Map of Ancient Near East.",
      applications: "Philosophical: Why something exists; Spiritual: divine order; Ethical: stewardship.",
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder1.jpg" alt="Torah Scroll Genesis 1">
        </div>
      `
    },
    {
      verse: "1:2",
      text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
      hebrew: {
        original: "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶךְ עַל-פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל-הַמָּיִם",
        transliteration: "Veha'aretz hayetah tohu vavohu, vechoshekh al-penei tehom, veruach Elohim merachefet al-hamayim",
        translationNotes: `
          "Tohu vavohu" = formless and void.
          Spirit of God (Ruach Elohim) signifies divine presence, movement, and creativity.
        `
      },
      theology: "God's Spirit active before the formal creation; divine order over chaos.",
      cosmology: "Earth as primordial chaos; waters as unformed matter.",
      chronology: "Early stage of creation; precedes separation of light and darkness.",
      symbolism: "Darkness represents unformed potential; Spirit hovering = readiness for creation.",
      messianicForeshadowing: "The Spirit presages Christ’s role as life-giving Logos.",
      artifacts: "[Placeholder] Ancient Near East creation diagrams; Dead Sea Scroll fragments.",
      maps: "[Placeholder] Map showing primeval waters concept in ANE cosmology.",
      applications: "Spiritual reflection: God’s presence before order; Ethical: preparing before acting.",
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder2.jpg" alt="Chaos Waters Illustration">
        </div>
      `
    },
    {
      verse: "1:3",
      text: "And God said, 'Let there be light,' and there was light.",
      hebrew: {
        original: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר",
        transliteration: "Vayomer Elohim yehi or, vayehi or",
        translationNotes: `
          Divine speech brings creation into existence; demonstrates power of God's word.
          Light represents knowledge, life, and divine presence.
        `
      },
      theology: "God’s word has authority; first separation of light from darkness.",
      cosmology: "Introduction of light as a physical and symbolic element; beginning of cosmic order.",
      chronology: "Marks the first day of creation.",
      symbolism: "Light = order, knowledge, divine presence; darkness = unformed chaos.",
      messianicForeshadowing: "Christ as the Light of the World (John 1:4–5).",
      artifacts: "[Placeholder] Ancient illumination depictions; manuscripts.",
      maps: "[Placeholder] Conceptual map of light creation in biblical cosmology.",
      applications: "Life lesson: clarity and order come from divine guidance; apply light metaphorically in ethics and spirituality.",
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder3.jpg" alt="Creation of Light Illustration">
        </div>
      `
    }
  ]
};
const genesisWeek2 = {
  week: 2,
  chapter: 2,
  title: "Genesis 2 – Completion of Creation and the Sabbath",
  overview: `
    Genesis 2 describes the completion of creation, the sanctification of the seventh day,
    and the establishment of rest. It expands on the order, purpose, and theological significance
    of the created world.
  `,
  verses: [
    {
      verse: "2:1",
      text: "Thus the heavens and the earth were completed in all their vast array.",
      hebrew: {
        original: "וַיְכֻלּוּ הַשָּׁמַיִם וְהָאָרֶץ וְכָל-צְבָאָם",
        transliteration: "Vayechulu hashamayim veha'aretz vechol-tzeva'am",
        translationNotes: `
          "Vayechulu" = they were finished; denotes completeness.
          Emphasizes totality of creation in both cosmic and earthly dimensions.
        `
      },
      theology: "God’s creative work is perfect and complete; divine order established.",
      cosmology: "All elements of universe now in place; cosmic harmony achieved.",
      chronology: "Marks the conclusion of the six days of creation.",
      symbolism: "Completion signifies divine perfection; readiness for rest.",
      messianicForeshadowing: "Perfect creation prefigures the peace and order Christ brings.",
      artifacts: "[Placeholder] Ancient manuscript fragments; illustration of completed creation.",
      maps: "[Placeholder] Map of Creation cosmology references in ANE.",
      applications: "Reflect on completeness of life and purpose; work toward order and harmony.",
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder4.jpg" alt="Completed Creation Illustration">
        </div>
      `
    },
    {
      verse: "2:2",
      text: "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.",
      hebrew: {
        original: "וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה וַיָּנַח בַּיּוֹם הַשְּׁבִיעִי מִכָּל-מְלַאכְתּוֹ אֲשֶׁר עָשָׂה",
        transliteration: "Vayechal Elohim bayom hashvi'i melachto asher asah vayanach bayom hashvi'i mikol-melachto asher asah",
        translationNotes: `
          God’s rest establishes the Sabbath; resting does not imply fatigue but completion and sanctity.
        `
      },
      theology: "Sabbath instituted as holy; sets precedent for divine rhythm of work and rest.",
      cosmology: "Order of days culminates in rest; universe aligned with divine rhythm.",
      chronology: "Seventh day follows six days of creation.",
      symbolism: "Rest symbolizes peace, sanctity, and divine presence.",
      messianicForeshadowing: "Christ as the ultimate rest and fulfillment of divine purpose.",
      artifacts: "[Placeholder] Ancient Sabbath-related scroll fragments.",
      maps: "[Placeholder] Conceptual map of creation week in ANE context.",
      applications: "Spiritual: observe rest; Ethical: balance work and reflection; Daily life: Sabbath principles.",
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder5.jpg" alt="Sabbath Rest Illustration">
        </div>
      `
    },
    {
      verse: "2:3",
      text: "Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done.",
      hebrew: {
        original: "וַיְבָרֶךְ אֱלֹהִים אֶת-הַיּוֹם הַשְּׁבִיעִי וַיְקַדֵּשׁ אֹתוֹ כִּי בוֹ שָׁבַת מִכָּל-מְלַאכְתּוֹ אֲשֶׁר בָּרָא אֱלֹהִים לַעֲשׂוֹת",
        transliteration: "Vayvarech Elohim et-hayom hashvi'i vayekadesh oto ki bo shavat mikol-melachto asher bara Elohim la'asot",
        translationNotes: `
          God not only rests but blesses and sanctifies the day, emphasizing holiness and divine approval.
        `
      },
      theology: "God’s blessing of the seventh day provides a model for human practice of rest and worship.",
      cosmology: "Universe’s creation cycle completed and sanctified.",
      chronology: "Seventh day inaugurated as holy.",
      symbolism: "Blessing and holiness denote sacred time; divine rhythm mirrored in human life.",
      messianicForeshadowing: "Ultimate rest found in Christ; Sabbath as spiritual typology.",
      artifacts: "[Placeholder] Early Jewish Sabbath codices; art depicting sanctified seventh day.",
      maps: "[Placeholder] Map of Ancient Israel showing Sabbath observance regions.",
      applications: "Apply principle of sanctified rest in daily life; spiritual and ethical reflection.",
      images: `
        <div class="study-images">
          <img src="/media/bible/genesis/placeholder6.jpg" alt="Sanctified Seventh Day Illustration">
        </div>
      `
    }
  ]
};

// Render Genesis 2
renderStudy(genesisWeek2);

// Render function already in biblestudy.js
renderStudy(genesisWeek1);

// Call the render function
renderStudy(genesisWeek1);

const genesisWeek3 = {
  week: 3,
  chapter: 3,
  title: "Genesis 3 – The Fall of Man",
  overview: `
    Genesis 3 describes the entrance of sin into the world through Adam and Eve’s disobedience.
    This chapter explains the consequences of the fall, the promise of redemption, and God’s plan for humanity.
  `,
  verses: [
    {
      verse: "3:1",
      text: "Now the serpent was more crafty than any of the wild animals the Lord God had made.",
      hebrew: {
        original: "וְהַנָּחָשׁ הָיָה עָרוּם מִכָּל-חַיַּת הַשָּׂדֶה אֲשֶׁר עָשָׂה יְהוָה אֱלֹהִים",
        transliteration: "Veha-nachash hayah arum mikol-chayat hasadeh asher asah Yahweh Elohim",
        translationNotes: "Craftiness implies deception; serpent as symbol of temptation and evil."
      },
      theology: "Introduces sin and human susceptibility; Satanic or symbolic agent of temptation.",
      cosmology: "Earthly creation interacts with spiritual forces; moral dimension enters cosmos.",
      chronology: "Early human history; before the expulsion from Eden.",
      symbolism: "Serpent = cunning, deception, and opposition to God.",
      messianicForeshadowing: "Protoevangelium (3:15) foretells Christ’s victory over sin.",
      artifacts: "[Placeholder] Ancient serpent motifs; Edenic garden depictions.",
      maps: "[Placeholder] Conceptual Eden map.",
      applications: "Awareness of temptation; need for discernment and obedience.",
      images: `<div class="study-images"><img src="/media/bible/genesis/placeholder7.jpg" alt="Serpent Illustration"></div>`
    },
    {
      verse: "3:2-3",
      text: "The woman said to the serpent, 'We may eat fruit from the trees in the garden, but God did say, 'You must not eat fruit from the tree that is in the middle of the garden, and you must not touch it, or you will die.''",
      hebrew: { original: "[Placeholder]", transliteration: "[Placeholder]", translationNotes: "Clarifies God’s command and limits." },
      theology: "Introduction of divine commandment; first instance of human dialogue with temptation.",
      cosmology: "Garden as microcosm of ordered creation; boundaries indicate moral law.",
      symbolism: "Tree of knowledge symbolizes discernment, free will, and obedience.",
      messianicForeshadowing: "Human disobedience sets stage for Messiah as Redeemer.",
      artifacts: "[Placeholder] Ancient garden iconography.",
      maps: "[Placeholder] Eden layout depiction.",
      applications: "Ethical reflection on obedience; consequences of choices.",
      images: `<div class="study-images"><img src="/media/bible/genesis/placeholder8.jpg" alt="Garden Dialogue Illustration"></div>`
    },
    {
      verse: "3:4-5",
      text: "You will not certainly die,' the serpent said to the woman. 'For God knows that when you eat from it your eyes will be opened, and you will be like God, knowing good and evil.'",
      hebrew: { original: "[Placeholder]", transliteration: "[Placeholder]", translationNotes: "Serpent deceives with half-truth." },
      theology: "Sin framed as aspiration; human pride vs. divine authority.",
      symbolism: "Knowledge of good and evil represents moral autonomy.",
      messianicForeshadowing: "Christ restores what was lost through disobedience.",
      applications: "Discernment is key; temptation may appear beneficial but carries consequences.",
      images: `<div class="study-images"><img src="/media/bible/genesis/placeholder9.jpg" alt="Serpent Temptation Illustration"></div>`
    },
    {
      verse: "3:6-7",
      text: "When the woman saw that the fruit of the tree was good for food and pleasing to the eye, and also desirable for gaining wisdom, she took some and ate



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
const proverbs101 = {
  week: "Proverbs 1:1",
  chapter: 1,
  title: "Proverbs 1:1 – The Wisdom of Solomon",
  overview: `
    Proverbs 1:1 introduces the book of wisdom, attributed to Solomon. It sets the stage for practical,
    moral, and spiritual lessons that guide daily life, leadership, and understanding of God’s principles.
  `,
  verses: [
    {
      verse: "1:1",
      text: "The proverbs of Solomon son of David, king of Israel:",
      hebrew: {
        original: "מִשְׁלֵי שְׁלֹמֹה בֶּן דָּוִד מֶלֶךְ יִשְׂרָאֵל",
        transliteration: "Mishlei Shlomo ben David Melekh Yisrael",
        translationNotes: `
          Emphasizes authorship and lineage.
          "Mishlei" refers to wise sayings or proverbs.
          Highlights Solomon’s authority as king and teacher.
        `
      },
      theology: `
        Demonstrates divine wisdom through human authorship.
        Shows the connection between royal authority and spiritual guidance.
      `,
      cosmology: `
        Not about the cosmos—focuses on moral and ethical order.
        Wisdom is framed as a guiding principle in society.
      `,
      chronology: `
        Traditional dating: Solomon’s reign circa 970–931 BCE.
        Context: post-Temple period, Israel as a unified kingdom.
      `,
      symbolism: `
        "Son of David" symbolizes legitimacy, continuity, and the Messianic line.
        Wisdom is personified throughout Proverbs.
      `,
      messianicForeshadowing: `
        References Davidic line, pointing toward Jesus Christ as ultimate fulfillment of wisdom and kingly authority.
      `,
      artifacts: `
        [Placeholder] Ancient Hebrew manuscripts
        [Placeholder] Scroll fragments from Israel Museum collections
      `,
      maps: `
        [Placeholder] Map of ancient Israel highlighting Jerusalem, the political center of Solomon’s reign
      `,
      applications: `
        Practical wisdom for leaders and daily life.
        Ethical guidance rooted in spiritual principles.
        Encouragement to seek wisdom early and respect authority.
      `,
      images: `
        <div class="study-images">
          <img src="/media/bible/proverbs/placeholder1.jpg" alt="Ancient Hebrew Manuscript">
          <img src="/media/bible/proverbs/placeholder2.jpg" alt="Map of Ancient Israel">
          <img src="/media/bible/proverbs/placeholder3.jpg" alt="Solomon Illustration">
        </div>
      `
    }
  ]
};

// Render function reuse from Genesis
renderStudy(proverbs101);
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
