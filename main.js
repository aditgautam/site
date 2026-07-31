const projectList = document.querySelector("#project-list");

const makeElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const makeProject = (project) => {
  const details = makeElement("details", "project");
  const summary = makeElement("summary");
  summary.append(makeElement("span", "project-title", project.title));
  summary.append(makeElement("span", "year", project.year));
  details.append(summary);

  const body = makeElement("div", "project-body");

  if (project.image) {
    const image = makeElement("img", "project-media");
    image.src = project.image;
    image.alt = project.imageAlt || "";
    image.loading = "lazy";
    body.append(image);
  }

  body.append(makeElement("p", null, project.description));

  if (project.tags?.length) {
    const meta = makeElement("div", "project-meta");
    project.tags.forEach((tag) => meta.append(makeElement("span", null, tag)));
    body.append(meta);
  }

  if (project.link || project.repo) {
    const actions = makeElement("div", "project-actions");
    [["writeup", project.link], ["repo", project.repo]].forEach(([label, url]) => {
      if (!url) return;
      const anchor = makeElement("a", null, label);
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      actions.append(anchor);
    });
    body.append(actions);
  }

  details.append(body);
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".project[open]").forEach((projectElement) => {
      if (projectElement !== details) projectElement.open = false;
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
