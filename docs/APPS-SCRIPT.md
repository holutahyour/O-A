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
// A phone is compared on its last ten digits, so 0807..., +234 807... and
// 234807... all count as the same guest. Sheets may also have dropped the
// leading zero from a stored number; ten digits covers that too.
function phoneKey(value) {
  return String(value).replace(/[^0-9]/g, '').slice(-10);
}

function emailKey(value) {
  return String(value).trim().toLowerCase();
}

function reply(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

// The Gifts and Headwear tabs are made, with their headers, the first time
// something is recorded in them.
function tab(name, headers) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(name);
  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  // One submission at a time, so two sent together cannot both slip past
  // the duplicate check.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(8000);

    var data = JSON.parse(e.postData.contents);
    var at = data.submittedAt || new Date().toISOString();

    if (data.type === 'gift') {
      tab('Gifts', ['Submitted at', 'Name', 'Amount said', 'Seen in bank'])
        .appendRow([at, data.name || '', data.amount || '', '']);
      return reply({ ok: true });
    }

    if (data.type === 'headwear') {
      tab('Headwear', ['Submitted at', 'Name', 'Gele', 'Fila', 'Total', 'Paid', 'Collected'])
        .appendRow([at, data.name || '', data.gele || 0, data.fila || 0, data.total || 0, '', '']);
      return reply({ ok: true });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');

    var phone = phoneKey(data.phone || '');
    var email = emailKey(data.email || '');

    // Columns C and D: every phone and email already on the list.
    var last = sheet.getLastRow();
    var rows = last > 1 ? sheet.getRange(2, 3, last - 1, 2).getValues() : [];
    for (var i = 0; i < rows.length; i++) {
      var samePhone = phone && phoneKey(rows[i][0]) === phone;
      var sameEmail = email && emailKey(rows[i][1]) === email;
      if (samePhone || sameEmail) {
        return reply({ ok: false, duplicate: true });
      }
    }

    sheet.appendRow([
      at,
      data.name || '',
      data.phone || '',
      data.email || '',
      data.attending || '',
      data.message || '',
      data.requestedCard ? 'Yes' : ''
    ]);

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
```

Save it.

### Gifts and headwear

The same script keeps two more lists, each in its own tab. You do not need to
make these tabs — the script adds them, with headers, the first time they are
needed.

| Tab | Written when a guest… | Columns |
|---|---|---|
| `Gifts` | presses **I have sent my gift** | Submitted at, Name, Amount said, Seen in bank |
| `Headwear` | presses **Request on WhatsApp** for a gele or fila | Submitted at, Name, Gele, Fila, Total, Paid, Collected |

**Seen in bank**, **Paid** and **Collected** are left empty for you to fill in.
That matters: a row is only what the guest said. A `Gifts` row is not a bank
alert, and the amount is whatever they typed, if anything. Check each one
against the account before ticking it off.

A row is written as WhatsApp opens, so a guest who presses the button and then
does not send the message is still on the list.

### Duplicates

The script turns away an RSVP whose phone number or email is already in the
sheet, and the guest is told they are already on the list and to call if they
need to change their answer. The site's `/api/rsvp` route also remembers the
phones and emails it has taken, so a repeat is refused without asking the sheet
— but that memory is cleared whenever the server restarts, so the check in this
script is the one that counts.

To let a guest respond again, delete their row from the sheet. If they are
still refused straight afterwards, the site is remembering them: redeploy, or
wait for the server to restart.

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
