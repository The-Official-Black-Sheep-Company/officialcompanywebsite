const bibleStudies = {
    genesis: [
        {
            week: 1,
            chapter: 1,
            title: "Genesis 1: Ultimate Scholarly Reference",
            overview: `
                This entry provides a full scholarly treatment of Genesis 1, engaging the Hebrew text, 
                textual criticism, ANE parallels, cosmology, literary structure, theology, 
                reception history, and scholarly debate.
            `,
            abstract: "This entry provides a full scholarly treatment of Genesis 1, engaging the Hebrew text, textual criticism, ANE parallels, cosmology, literary structure, theology, reception history, and scholarly debate. Suitable for citation by researchers and theologians.",
            translation: "<strong>Bereshit bara Elohim et hashamayim ve'et ha'aretz.</strong> – 'In the beginning, God created the heavens and the earth.'",
            textualNotes: "Masoretic Text (MT) standard; LXX includes minor order variation; Samaritan Pentateuch shows orthographic differences.",
            historicalContext: "Contrasts with Enuma Elish and Atrahasis; no divine conflict, emphasizes functional creation.",
            literaryStructure: "7-day symmetry, forming/filling, repeated divine speech, numerical patterns.",
            canonicalThread: "Cross-references: Psalm 104, Isaiah 40, John 1, Colossians 1, Hebrews 1, Revelation 21–22.",
            receptionHistory: "Patristic, Medieval, Reformers interpretations summarized.",
            scholarlyPositions: [
                { scholar: "Walton", position: "Functional creation - the cosmos as God's temple." },
                { scholar: "Wenham", position: "Literal/structured framework with theological focus." },
                { scholar: "Waltke", position: "Theological narrative emphasizing divine sovereignty." },
                { scholar: "von Rad", position: "Literary masterpiece of priestly tradition." }
            ],
            scienceFaith: "Young Earth, Old Earth, Framework hypothesis, analogical days, and day-age theories.",
            timeline: [
                { year: -2000, label: "Patriarchal Era" },
                { year: -1800, label: "Babylonian Creation Texts (Enuma Elish)" },
                { year: -1446, label: "Traditional Exodus Date / Mosaic Authorship" }
            ],
            genealogy: {
                name: "Adam",
                children: [
                    { name: "Seth", children: [{ name: "Enosh", children: [] }] },
                    { name: "Cain", children: [] },
                    { name: "Abel", children: [] }
                ]
            },
            verses: [
                {
                    verse: "1:1",
                    text: "In the beginning God created the heavens and the earth.",
                    hebrew: {
                        original: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
                        transliteration: "Bereshit bara Elohim et hashamayim ve'et ha'aretz",
                        translationNotes: `
                            <strong>Bereshit</strong> – absolute origin or starting point of divine ordering.<br>
                            <strong>Bara</strong> – divine creation verb, creating ex nihilo.<br>
                            <strong>Elohim</strong> – majestic plural, emphasizing sovereignty.
                        `
                    },
                    theology: "Creation ex nihilo; first implicit mention of the Messiah; God as ultimate planner.",
                    cosmology: "Contrasts with Ancient Near East creation myths; no divine conflict, emphasizes functional creation.",
                    chronology: "Symbolic beginning of time; theological framework guides interpretation.",
                    symbolism: "Separation of heaven and earth foreshadows order from chaos.",
                    messianicForeshadowing: "Plural 'Elohim' hints at Trinity; first subtle reference to Christ.",
                    artifacts: [
                        { name: "Enuma Elish Tablet", description: "Babylonian creation epic tablet." },
                        { name: "Masoretic Scroll Fragment", description: "Earliest Hebrew text fragment of Genesis 1." }
                    ],
                    applications: "Philosophical: Why something exists; Spiritual: divine order; Ethical: stewardship.",
                    images: `
                        <div class="study-images">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Enuma_Elish.jpg" alt="Enuma Elish Tablet">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Dead_Sea_Scrolls_4QGenesis.jpg" alt="Dead Sea Scroll Genesis 1">
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
        },
        {
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
        },
        {
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
                    text: "The woman said to the serpent, 'We may eat fruit from the trees in the garden, but God did say, \'You must not eat fruit from the tree that is in the middle of the garden, and you must not touch it, or you will die.\''",
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
                    text: "\'You will not certainly die,\' the serpent said to the woman. \'For God knows that when you eat from it your eyes will be opened, and you will be like God, knowing good and evil.\'",
                    hebrew: { original: "[Placeholder]", transliteration: "[Placeholder]", translationNotes: "Serpent deceives with half-truth." },
                    theology: "Sin framed as aspiration; human pride vs. divine authority.",
                    symbolism: "Knowledge of good and evil represents moral autonomy.",
                    messianicForeshadowing: "Christ restores what was lost through disobedience.",
                    applications: "Discernment is key; temptation may appear beneficial but carries consequences.",
                    images: `<div class="study-images"><img src="/media/bible/genesis/placeholder9.jpg" alt="Serpent Temptation Illustration"></div>`
                }
            ]
        }
    ],
    proverbs: [
        {
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
        }
    ],
    matthew: [],
    revelation: []
};

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bible-study-container");
    if (!container) return;

    const renderStudy = (study) => {
        let html = `
      <h2 class="study-header">${study.title}</h2>
      <div class="scholarly-abstract"><h3>Abstract</h3><p>${study.abstract || study.overview}</p></div>
    `;

        if (study.translation) html += `<h3>Translation</h3><p class="study-box">${study.translation}</p>`;
        if (study.textualNotes) html += `<h3>Textual-Critical Notes</h3><p class="study-box">${study.textualNotes}</p>`;
        if (study.historicalContext) html += `<h3>Ancient Near Eastern Context</h3><p class="study-box">${study.historicalContext}</p>`;
        if (study.literaryStructure) html += `<h3>Literary Structure</h3><p class="study-box">${study.literaryStructure}</p>`;
        if (study.canonicalThread) html += `<h3>Canonical Thread</h3><p class="study-box">${study.canonicalThread}</p>`;
        if (study.receptionHistory) html += `<h3>Reception History</h3><p class="study-box">${study.receptionHistory}</p>`;

        if (study.scholarlyPositions) {
            html += `<h3>Scholarly Positions</h3><ul class="scholarly-list">`;
            study.scholarlyPositions.forEach(p => {
                html += `<li><strong>${p.scholar}:</strong> ${p.position}</li>`;
            });
            html += `</ul>`;
        }

        if (study.scienceFaith) {
            html += `<h3>Science & Faith Dialogue</h3><p>${study.scienceFaith}</p>`;
        }

        if (study.timeline) {
            html += `<h3>Timeline</h3><div class="timeline-container">`;
            study.timeline.forEach(t => {
                html += `<div class="timeline-item"><strong>${t.year}:</strong> ${t.label}</div>`;
            });
            html += `</div>`;
        }

        if (study.genealogy) {
            const renderTree = (node) => {
                let treeHtml = `<li>${node.name}`;
                if (node.children && node.children.length > 0) {
                    treeHtml += "<ul>";
                    node.children.forEach(child => { treeHtml += renderTree(child); });
                    treeHtml += "</ul>";
                }
                treeHtml += "</li>";
                return treeHtml;
            };
            html += `<h3>Genealogy</h3><div class="tree"><ul>${renderTree(study.genealogy)}</ul></div>`;
        }

        study.verses.forEach(v => {
            html += `
        <div class="verse-section">
          <h3>Verse ${v.verse}</h3>
          <p>${v.text}</p>
          <h4>Hebrew</h4>
          <p>${v.hebrew.original} (${v.hebrew.transliteration})</p>
          <div class="hebrew-notes">${v.hebrew.translationNotes}</div>
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
          <ul class="artifact-list">
            ${Array.isArray(v.artifacts) ? v.artifacts.map(a => `<li><strong>${a.name}:</strong> ${a.description}</li>`).join('') : `<li>${v.artifacts}</li>`}
          </ul>
          <h4>Applications</h4>
          <p>${v.applications}</p>
          ${v.images}
        </div>
        <hr>
      `;
        });
        return html;
    };

    let content = "";
    bibleStudies.genesis.forEach(study => {
        content += renderStudy(study);
    });
    bibleStudies.proverbs.forEach(study => {
        content += renderStudy(study);
    });
    
    container.innerHTML = content;
});
