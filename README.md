# boochslut

Splash page for boochslut kombucha, moved off Squarespace. It's a single static page (`index.html`), deployed with GitHub Pages.

## Signup form

The "join for the latest booch drops" form saves to a Google Sheet through `google-apps-script/Code.gs`. To connect it:

1. Create a sheet at https://sheets.new (signed in as benlk92@gmail.com).
2. Open **Extensions → Apps Script**, paste `google-apps-script/Code.gs`, and save.
3. Run **setup** once and approve the permissions.
4. Go to **Deploy → New deployment → Web app**, with Execute as: **Me** and Who has access: **Anyone**.
5. Put the web app URL in `SIGNUP_URL` near the bottom of `index.html`.

Until then, the form says signups aren't connected yet. On localhost it pretends to succeed, so you can preview it.

## Preview

```bash
python3 -m http.server 8081
```
