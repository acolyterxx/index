# Domain Glossary

This project is a mobile-friendly administrative form app for the Agricultural Technology Research Institute/Livestock Research Institute workflow.

- `危害告知單`: the contractor work environment hazard notice form. The mobile/web form can differ from the printed template, but PDF output should follow the source Word/PDF layout as closely as practical.
- `作業巡檢表`: the inspection form entry point. It contains multiple inspection form definitions and month/date selection.
- `暫存清冊`: the home-page draft list backed by localStorage. Saved hazard and inspection drafts should both appear here and open back into editable forms.
- `表單版本`: the source document version shown on the home page and used as the reference for PDF output.
- `列印模板`: the print-only layout generated from the web form data. It is the stable surface for PDF output rules.
- `簽章`: hand-written canvas signatures. Signatures should belong to the active form/draft and should stay blank when no signature was provided.

## Long-Term Form Replacement Rules

- Keep mobile data-entry screens ergonomic; do not force Word/PDF layout into the mobile screen.
- Keep PDF output close to the original source document layout.
- Centralize repeated print rules such as font, borders, page margins, date columns, signature placement, and form version metadata.
- When replacing a source form, update the form catalog first, then verify homepage labels, web defaults, draft behavior, and PDF output.
- Do not split the lab safety inspection table into multiple generated tables unless a future ADR explicitly reverses that decision.
