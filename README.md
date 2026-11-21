# Resume Skill Finder

A mobile-friendly portfolio project that compares a resume with a job description, shows which recognized skills overlap, and links to free training for missing skills.

## Run on an iPhone using Safari and Replit

1. Save resume-skill-finder.zip to Files using Share → Save to Files if necessary. Keep the ZIP intact for Replit.
2. Open https://replit.com/import, sign in, choose ZIP, and select the archive from Files.
3. Open the imported project and tap Run. Open Preview or open the preview in a new Safari tab. The included .replit configuration starts a preview server. If needed, run `python3 -m http.server 5000 --bind 0.0.0.0` from Shell in the project root. If the editor is cramped, use Safari’s Request Desktop Website.
4. Tap **Try sample data**. Expect **60%**, three matching skills, and links for Power BI and Tableau.
5. To try an actual PDF, clear the sample resume text, choose a PDF from Files, paste a job description, and tap Analyze skills. Pasted resume text takes priority when both inputs are filled.

## Files

- index.html — Homepage, input form, and results dashboard.
- style.css — Layout, colors, and mobile styles.
- script.js — Skill catalog, PDF extraction, scoring, and recommendations.
- .replit — Optional Replit preview configuration.
- README.md — Instructions and project notes.

## How the score works

The app extracts unique skills named in its catalog from both inputs. The score is 100 × matching skills ÷ recognized job skills, rounded to a whole number. Aliases such as JS and JavaScript count as one skill. Excel is recognized with its capitalized product name or with Microsoft/MS to reduce matches on the ordinary verb. Add more skills and resources by extending the skills array in script.js.

Version 1 uses keyword rules. The score measures skill mentions in the current catalog and treats them equally. It cannot assess proficiency, interpret every synonym, or distinguish an optional skill from a mandatory one. PDF.js loads from cdnjs when needed. Resume text is processed locally and the app does not store it. Scanned or password-protected PDFs may need to be replaced with pasted text.

## Seven-day plan

| Day | Goal | Check |
|---|---|---|
| 1 | Import the starter and read index.html and style.css | Homepage opens in Safari |
| 2 | Review the form and the PDF reader in script.js | You can choose a PDF and paste a job description |
| 3 | Study findSkills and add one catalog entry | Its name and aliases detect consistently |
| 4 | Review the score calculation | Three matches out of five give 60% |
| 5 | Review showList and edit a learning link | Each missing skill has a helpful free resource |
| 6 | Test on Safari with two text resumes, one text PDF, and one scanned PDF | Results update, and the text fallback works |
| 7 | Upload the source to GitHub and deploy with Vercel | Both the repository and the live site open in Safari |

## Publish free

1. In Files, tap the downloaded ZIP to extract the project files.
2. Visit https://github.com/new and create a public repository named resume-skill-finder. Initialize it with a README if needed to access the upload menu.
3. In your repository choose Add file → Upload files. Upload index.html, style.css, script.js, and README.md from Files and commit. If GitHub already made a README, you can replace its contents using the editor. The .replit configuration is only used during development. Your repository should have index.html at its root.
4. Sign in at https://vercel.com using GitHub and choose the free Hobby plan for personal, non-commercial projects. Select Add New → Project and import resume-skill-finder. Grant access to this repository if asked.
5. Select Other as the Framework Preset and use the repository root with default build and output settings. Tap Deploy. Use the supplied vercel.app address.
6. Open your live address in Safari and try the sample again. If you change files in Replit, commit the changed files to GitHub to update the connected deployment.
