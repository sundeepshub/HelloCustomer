# HelloCustomer — Insurance Advisory Landing Page

A lead-generation landing page for Health, Term, Personal Accident and
Maternity insurance advisory, built as a static site so it can be hosted
free on GitHub Pages.

## Project structure

```
index.html              Main page (links the CSS and JS below)
css/style.css            All styling
js/script.js              All interactivity: conditional form logic,
                          pincode auto-fill, tabs, testimonials, submit handler
assets/                  Put your photos, logo, and videos here (see assets/README.md)
apps-script/Code.gs       Google Apps Script — turns form submissions into
                          rows in a Google Sheet (downloadable as .xlsx)
```

## 1. Deploy to GitHub Pages

1. Create a new GitHub repository (public, so Pages can serve it for free).
2. Upload every file in this project keeping the same folder structure —
   easiest via `git`:
   ```
   git init
   git add .
   git commit -m "HelloCustomer landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
   Or use GitHub's web "Add file → Upload files" and drag in the folders.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**, then Save.
5. GitHub gives you a live URL, typically:
   `https://<your-username>.github.io/<repo-name>/`
   It can take a minute or two to go live after the first deploy.

## 2. Add your profile photo

Drop a photo named exactly `advisor-photo.jpg` into the `assets/` folder.
It's used automatically in the header avatar and the About section — see
`assets/README.md` for details. Until you add it, a clean "HC" placeholder
is shown instead, so the site looks fine either way.

## 3. Connect the lead capture backend (Google Sheets, exportable to Excel)

GitHub Pages can only serve static files — it can't write an Excel file to
disk by itself. The free workaround used here is a Google Sheet:

1. Follow the step-by-step instructions at the top of `apps-script/Code.gs`.
2. Paste your deployed Web App URL into `GOOGLE_SCRIPT_URL` near the bottom
   of `js/script.js`.
3. Push the change. Every form submission now becomes a row in your Google
   Sheet, which you can download any time as `.xlsx` via
   File → Download → Microsoft Excel.

Until you do this, submissions still work and show the thank-you message —
they're just logged to the browser console instead of saved anywhere, so you
can test the form safely before wiring up the sheet.

## 4. Add real testimonials, photos & videos

- Testimonials in `js/script.js` (`templates` object) are placeholders
  generated for coverage across Hyderabad, Telangana and Andhra Pradesh —
  replace them with real, verified customer feedback before publishing.
- The "Photos & Videos" section on the page has instructions in
  `assets/README.md` for swapping in real media.

## 5. A note on the pincode auto-fill

The Area / District / State auto-fill uses the free, open
`api.postalpincode.in` service directly from the browser. It doesn't need an
API key, but like any free third-party API it can occasionally be slow or
rate-limited under heavy traffic — the fields simply stay editable as plain
text boxes if the lookup doesn't return a result, so the form never gets
stuck.
