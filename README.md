# AAM Technology

AAM Technology is a technology and software development company focused on helping businesses build a strong digital presence. We create modern, responsive, and user-friendly websites and digital solutions tailored to the needs of businesses, startups, and organizations.

## Running the site

Built with React + Vite.

```bash
npm install
npm run dev      # start local dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the build exactly like GitHub Pages does
```

All site content (services, projects, team, contact details, social links) lives in `src/data.js`.

## Publishing

Every push to `main` builds the site and publishes it to GitHub Pages automatically
(`.github/workflows/deploy.yml`). In the repo's Settings → Pages, Source must be set to **GitHub Actions**.
