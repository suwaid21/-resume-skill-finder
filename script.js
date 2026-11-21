// Each row lists the skill name, aliases, and a free learning resource.
const skills = [
  ["Python", [], "freeCodeCamp", "https://www.freecodecamp.org/learn/scientific-computing-with-python/"],
  ["SQL", ["Structured Query Language"], "SQLBolt", "https://sqlbolt.com/"],
  ["Excel", ["Microsoft Excel", "MS Excel"], "Microsoft Excel training", "https://support.microsoft.com/en-us/excel"],
  ["Power BI", ["PowerBI"], "Microsoft Learn", "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/"],
  ["Tableau", ["Tableau Desktop"], "Tableau free training videos", "https://www.tableau.com/learn/training"],
  ["HTML", ["HTML5"], "MDN Learn Web Development", "https://developer.mozilla.org/en-US/docs/Learn_web_development"],
  ["CSS", ["CSS3"], "MDN Learn Web Development", "https://developer.mozilla.org/en-US/docs/Learn_web_development"],
  ["JavaScript", ["JS", "ECMAScript"], "MDN JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"],
  ["React", ["React.js", "ReactJS"], "React Learn", "https://react.dev/learn"],
  ["Git", [], "Pro Git book", "https://git-scm.com/book/en/v2"],
  ["GitHub", [], "GitHub Skills", "https://skills.github.com/"],
  ["Machine Learning", ["ML"], "Google Machine Learning Crash Course", "https://developers.google.com/machine-learning/crash-course"],
  ["Pandas", [], "pandas getting started tutorials", "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"],
  ["Java", [], "dev.java tutorials", "https://dev.java/learn/"],
  ["TypeScript", [], "TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html"],
  ["Node.js", ["NodeJS", "Node JS"], "Node.js Learn", "https://nodejs.org/en/learn"],
  ["Docker", [], "Docker Get Started", "https://docs.docker.com/get-started/"],
];

const byId = (id) => document.getElementById(id);
const form = byId("analyzer");
const pdf = byId("pdf");
const resume = byId("resume");
const job = byId("job");
const demo = byId("demo");
const results = byId("results");
const status = byId("status");

function findSkills(text) {
  const normalized = text.normalize("NFKC").replace(/\s+/g, " ");
  return skills.filter(([name, aliases]) => [name, ...aliases].some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flags = term === "Excel" && !/\b(?:microsoft|ms) excel\b/i.test(normalized) ? "" : "i";
    return new RegExp(`(^|[^\\p{L}\\p{N}_])${escaped}(?=$|[^\\p{L}\\p{N}_])`, flags + "u").test(normalized);
  }));
}

async function readPdf(file) {
  if (!/\.pdf$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
    throw new Error("Choose a PDF up to 10 MB, or paste your resume text.");
  }
  try {
    const cdn = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/";
    const pdfjs = await import(cdn + "pdf.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = cdn + "pdf.worker.min.mjs";
    const loading = pdfjs.getDocument({
      data: await file.arrayBuffer(),
      isEvalSupported: false,
      useWorkerFetch: false,
    });
    try {
      const document = await loading.promise;
      if (document.numPages > 20) return "";
      const pages = [];
      for (let i = 1; i <= document.numPages; i++) {
        const page = await document.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => item.str ?? "").join(" "));
        page.cleanup();
      }
      return pages.join("\n").trim();
    } finally {
      await loading.destroy();
    }
  } catch {
    throw new Error("This PDF couldn’t be read. Check your connection or paste the resume text. Password-protected PDFs need to be unlocked first.");
  }
}

function showList(id, entries, empty, withLinks = false) {
  const list = byId(id);
  list.replaceChildren();
  if (!entries.length) {
    const item = document.createElement("li");
    item.textContent = empty;
    list.append(item);
  }
  for (const [name, , provider, url] of entries) {
    const item = document.createElement("li");
    item.textContent = name;
    if (withLinks) {
      const link = document.createElement("a");
      link.href = url;
      link.textContent = provider;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.append(" — ", link);
    }
    list.append(item);
  }
}

form.addEventListener("input", () => {
  results.hidden = true;
  status.textContent = "";
});
demo.addEventListener("click", () => {
  pdf.value = "";
  resume.value = "I built a sales dashboard using Python, SQL, and Excel.";
  job.value = "Data analyst internship. Skills: Python, SQL, Excel, Power BI, and Tableau.";
  form.requestSubmit();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  results.hidden = true;
  status.textContent = "";
  const target = findSkills(job.value);
  if (!target.length) {
    status.textContent = "No supported skills found in the job description. Try including named tools such as Python, SQL, or Power BI.";
    return;
  }
  const file = pdf.files[0];
  let text = resume.value.trim();
  if (!text && !file) {
    status.textContent = "Choose a resume PDF or paste your resume text.";
    return;
  }
  for (const field of form.elements) field.disabled = true;
  form.setAttribute("aria-busy", "true");
  try {
    if (!text) {
      status.textContent = "Reading your PDF…";
      text = await readPdf(file);
      if (!text) throw new Error("No usable text was found. Use a text-based PDF under 21 pages or paste your resume text.");
    }
    const found = new Set(findSkills(text));
    const matched = target.filter((skill) => found.has(skill));
    const missing = target.filter((skill) => !found.has(skill));
    const score = Math.round(100 * matched.length / target.length);

    byId("score").textContent = `${score}%`;
    byId("progress").value = score;
    byId("summary").textContent =
      `${matched.length} of ${target.length} recognized job skills also appear in your resume. Each skill counts once.`;
    showList("matched", matched, "No matching skills detected.");
    showList("missing", missing, "All recognized job skills matched.");
    showList("courses", missing, "No skill gaps in the recognized list.", true);
    status.textContent = "";
    results.hidden = false;
    byId("results-title").focus();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    form.removeAttribute("aria-busy");
    for (const field of form.elements) field.disabled = false;
  }
});
