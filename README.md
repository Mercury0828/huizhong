# Hui Zhong — Academic Homepage

Personal academic homepage of **Hui Zhong**, Assistant Professor in the Department of
Computer Science and Software Engineering at Miami University.

Static site (HTML + CSS + vanilla JavaScript), no build step. Hosted on GitHub Pages.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html        # all page content
css/style.css     # styles (light/dark, responsive)
js/main.js        # theme toggle, scroll reveal, publication filter
assets/           # photo, CV, logo, research illustrations
```

## Updating

Edit the files, then:

```bash
git add -A
git commit -m "Update content"
git push
```

GitHub Pages redeploys automatically within a minute or two.
