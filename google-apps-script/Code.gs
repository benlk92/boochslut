/**
 * boochslut signups: stores the "join for the latest booch drops" form
 * in this Google Sheet.
 *
 * Setup: Extensions > Apps Script, paste this file, run setup() once, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Put the web app URL in SIGNUP_URL in index.html.
 */

const SIGNUPS_SHEET = 'Signups';
const HEADERS = ['Timestamp', 'First name', 'Last name', 'Email', 'Opted in to emails'];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SIGNUPS_SHEET);
  if (!sheet) {
    sheet = ss.getSheets()[0].getLastRow() === 0
      ? ss.getSheets()[0].setName(SIGNUPS_SHEET)
      : ss.insertSheet(SIGNUPS_SHEET);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return json_({ ok: false, error: 'Submission rejected.' });

    const first = clean_(data.firstName);
    const last = clean_(data.lastName);
    const email = clean_(data.email);
    if (!first || !last || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json_({ ok: false, error: 'Please fill in your name and a valid email.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SIGNUPS_SHEET)
        .appendRow([new Date(), first, last, email, data.optIn === 'yes' ? 'yes' : 'no']);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'Something went wrong.' });
  }
}

// A leading apostrophe stores values like "=..." as text, so nobody can
// inject a spreadsheet formula.
function clean_(value) {
  const s = String(value || '').trim().slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
