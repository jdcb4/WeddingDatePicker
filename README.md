# Wedding Date Picker

A single-page joke app that picks a random wedding date in the next two years, then finds a reason it cannot possibly work.

## Cloudflare Pages

This is a static site. To deploy from a GitHub repo:

1. Push this folder to a GitHub repository, for example `WeddingDatePicker` or `wedding-date-picker`.
2. In Cloudflare Pages, create a project from that GitHub repository.
3. Use these build settings:
   - Framework preset: `None`
   - Build command: `exit 0`
   - Build output directory: `/`

The app runs from `index.html` with no package install step.

## Local preview

Open `index.html` directly in a browser, or run a tiny local server:

```powershell
python -m http.server 8788
```

Then visit `http://localhost:8788`.
