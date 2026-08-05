const projectList = document.querySelector("#project-list");

const makeElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const tagClass = (tag) => {
  const normalized = tag.toLowerCase();
  if (normalized === "python") return "tag-python";
  if (normalized === "c++") return "tag-cpp";
  if (normalized === "javascript") return "tag-javascript";
  if (normalized === "html/css") return "tag-web";
  if (normalized === "sqlite" || normalized === "sql" || normalized === "databases") return "tag-database";
  if (normalized === "d3.js") return "tag-d3";
  if (normalized === "machine learning") return "tag-ml";
  if (normalized === "research") return "tag-research";
  if (normalized === "ui/ux") return "tag-ui";
  if (normalized === "systems") return "tag-systems";
  return "tag-default";
};

const makeActions = (links, featured = false) => {
  const availableLinks = links.filter(({ url }) => url);
  if (!availableLinks.length) return null;

  const actions = makeElement(
    "div",
    featured ? "project-actions project-actions-featured" : "project-actions",
  );
  availableLinks.forEach(({ label, url }) => {
    const anchor = makeElement("a", null, label);
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    actions.append(anchor);
  });
  return actions;
};

const makeProject = (project) => {
  const details = makeElement("details", "project");
  const summary = makeElement("summary");
  summary.append(makeElement("span", "project-title", project.title));
  summary.append(makeElement("span", "year", project.year));
  details.append(summary);

  const body = makeElement("div", "project-body");

  const links = project.links || [
    { label: "writeup", url: project.link },
    { label: "repo", url: project.repo },
  ];
  const featuredActions = makeActions(links.filter(({ featured }) => featured), true);
  if (featuredActions) body.append(featuredActions);

  if (project.image) {
    const image = makeElement("img", "project-media");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.loading = "lazy";
    body.append(image);
  }

  const paragraphs = Array.isArray(project.description)
    ? project.description
    : [project.description];
  paragraphs.forEach((paragraph) => body.append(makeElement("p", null, paragraph)));

  if (project.tags?.length) {
    const meta = makeElement("div", "project-meta");
    project.tags.forEach((tag) => {
      const pill = makeElement("span", tagClass(tag));
      pill.append(makeElement("i", "tag-dot"));
      pill.append(document.createTextNode(tag));
      meta.append(pill);
    });
    body.append(meta);
  }

  const standardActions = makeActions(links.filter(({ featured }) => !featured));
  if (standardActions) body.append(standardActions);

  if (project.note) body.append(makeElement("p", "project-note", project.note));

  details.append(body);
  summary.addEventListener("click", (event) => {
    event.preventDefault();
    if (details.open) {
      details.open = false;
      return;
    }

    document.querySelectorAll(".project[open]").forEach((projectElement) => {
      projectElement.open = false;
    });
    requestAnimationFrame(() => {
      details.open = true;
    });
  });

  return details;
};

fetch("projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load projects.");
    return response.json();
  })
  .then((projects) => projects.forEach((project) => projectList.append(makeProject(project))))
  .catch(() => {
    projectList.textContent = "Projects could not be loaded.";
  });
