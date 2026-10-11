# RSVP → Google Sheet

RSVPs land in a Google Sheet you own. There is no database and no third-party
form service: the site posts to its own `/api/rsvp` route, which forwards to a
Google Apps Script web app, which appends a row.

Going through the site's own route (rather than posting to Google directly from
the browser) keeps the script URL out of the public JavaScript bundle and avoids
CORS entirely.

## 1. Make the sheet

Create a Google Sheet named something like **O&A RSVPs**. Add a tab named
exactly `RSVPs`, and put these headers in row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Submitted at | Name | Phone | Email | Attending | Message | Requested card |

The column order matters — it must match the `appendRow` call below.

## 2. Add the script

In the sheet: **Extensions → Apps Script**. Delete whatever is there and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.attending || '',
      data.message || '',
      data.requestedCard ? 'Yes' : ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Save it.

## 3. Deploy it

**Deploy → New deployment → Web app**, then:

- **Execute as:** Me
- **Who has access:** Anyone

Authorise it when Google asks. Copy the resulting web app URL — it looks like
`https://script.google.com/macros/s/AKfyc.../exec`.

## 4. Wire it up

Locally, put it in `.env.local`:

```
RSVP_ENDPOINT=https://script.google.com/macros/s/AKfyc.../exec
```

On Vercel, add the same key and value under **Settings → Environment
Variables**, then redeploy.

## 5. Check it

Submit a real RSVP through the site and confirm a row appears in the sheet with
every field populated. Then try submitting with the fields empty (you should see
inline validation) and with the network disconnected (you should see a failure
message pointing guests at the RSVP phone numbers).

## If it is not set

The site still works. `/api/rsvp` returns a 503, and the form shows guests a
message asking them to call the RSVP numbers instead. It never pretends an RSVP
was recorded when it was not.

## Changing the deployment later

Editing the script does **not** update the live web app. You must go to
**Deploy → Manage deployments**, edit the existing deployment, and publish a new
version — otherwise the old code keeps running and the fix appears to do
nothing.
