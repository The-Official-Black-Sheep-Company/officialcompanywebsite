// biblestudy-menu.js
(function() {
  const container = document.getElementById("biblical-study");
  if (!container) return;

  // Create menu container
  let menu = document.getElementById("bible-menu");
  if (!menu) {
    menu = document.createElement("div");
    menu.id = "bible-menu";
    menu.style.position = "fixed";
    menu.style.top = "100px";
    menu.style.left = "20px";
    menu.style.width = "250px";
    menu.style.maxHeight = "80vh";
    menu.style.overflowY = "auto";
    menu.style.backgroundColor = "#f9f9f9";
    menu.style.border = "1px solid #ccc";
    menu.style.padding = "10px";
    menu.style.fontFamily = "Arial, sans-serif";
    menu.style.fontSize = "14px";
    menu.style.zIndex = 9999;
    document.body.appendChild(menu);
  }

  menu.innerHTML = "<strong>Bible Study Menu</strong><br><br>";

  // Find all study headers and sections
  const headers = container.querySelectorAll(".study-header");
  headers.forEach((header, idx) => {
    const headerId = `study-header-${idx}`;
    header.id = headerId;

    // Create menu link for header
    const link = document.createElement("a");
    link.href = `#${headerId}`;
    link.textContent = header.textContent;
    link.style.display = "block";
    link.style.marginBottom = "5px";
    link.style.color = "#2c3e50";
    link.style.textDecoration = "none";
    link.onclick = (e) => {
      e.preventDefault();
      document.getElementById(headerId).scrollIntoView({ behavior: "smooth" });
    };

    menu.appendChild(link);

    // Find sections within this book
    const nextSibling = header.nextElementSibling;
    let sectionNode = nextSibling;
    while(sectionNode && !sectionNode.classList.contains("study-header")) {
      if(sectionNode.classList.contains("study-section")) {
        const secH3 = sectionNode.querySelector("h3");
        if(secH3) {
          const secId = `section-${idx}-${secH3.textContent.replace(/\s+/g,"-")}`;
          secH3.id = secId;
          const secLink = document.createElement("a");
          secLink.href = `#${secId}`;
          secLink.textContent = "  ↳ " + secH3.textContent;
          secLink.style.display = "block";
          secLink.style.marginLeft = "15px";
          secLink.style.fontSize = "13px";
          secLink.style.color = "#34495e";
          secLink.style.textDecoration = "none";
          secLink.onclick = (e) => {
            e.preventDefault();
            document.getElementById(secId).scrollIntoView({ behavior: "smooth" });
          };
          menu.appendChild(secLink);
        }
      }
      sectionNode = sectionNode.nextElementSibling;
    }
  });

})();
