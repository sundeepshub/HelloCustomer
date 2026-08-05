/**
 * HelloCustomer — Lead capture backend
 * -------------------------------------------------------------------------
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet.
 * Every form submission from the landing page becomes one row.
 * The sheet can be downloaded as .xlsx at any time:
 *   File -> Download -> Microsoft Excel (.xlsx)
 *
 * SETUP
 * 1. Go to https://sheets.google.com and create a new, blank spreadsheet.
 *    Name it something like "HelloCustomer Leads".
 * 2. In the sheet, go to Extensions -> Apps Script.
 * 3. Delete any starter code in the editor and paste this entire file.
 * 4. Click "Deploy" -> "New deployment".
 *    - Select type: "Web app"
 *    - Description: "HelloCustomer lead capture"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 5. Click "Deploy", authorize the script when prompted, and copy the
 *    Web App URL it gives you.
 * 6. Open js/script.js in this project and paste that URL into:
 *      const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
 * 7. Push the change to GitHub. New leads will now appear as rows in your
 *    Google Sheet automatically.
 *
 * NOTE: Because the form calls this with mode:'no-cors', the browser can't
 * read the response — that's expected and fine; the row is still saved.
 */

const SHEET_NAME = "Leads";

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  const data = JSON.parse(e.postData.contents);
  const keys = Object.keys(data);

  // First-ever submission: write the header row from whatever keys arrive.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(keys);
    sheet.setFrozenRows(1);
  }

  // Align each submission to the existing header order, adding any new
  // columns at the end automatically if the form ever gains new fields.
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newKeys = keys.filter(k => headers.indexOf(k) === -1);
  if (newKeys.length) {
    sheet.getRange(1, headers.length + 1, 1, newKeys.length).setValues([newKeys]);
    headers = headers.concat(newKeys);
  }

  const row = headers.map(h => (data[h] !== undefined ? data[h] : ""));
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lets you sanity-check the deployment by visiting the Web App URL directly.
function doGet() {
  return ContentService
    .createTextOutput("HelloCustomer lead capture endpoint is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
