// Client ID and API key from the Developer Console
const CLIENT_ID = '514837017664-4g4cgkkf1u47pbc9ob9buiv0q1c03s5g.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4",
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets';

// TODO: this should be a var got from sheet metadata
const RANGE = 'Transactions!B3:E369'

function onSignIn() {
    const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

    document.getElementById('profile_name').innerText = profile.getName();
    document.getElementById('profile_email').innerText = profile.getEmail();
    document.getElementById('profile_img').setAttribute('src', profile.getImageUrl());
    showById('profile_img');
    hideById('signin_btn');
    showById('signout_btn');

    showInfo('Signed in.');
}

function onSignOut() {
    document.getElementById('profile_name').innerText = null;
    document.getElementById('profile_email').innerText = null;
    document.getElementById('profile_img').setAttribute('src', null);
    hideById('profile_img');
    showById('signin_btn');
    hideById('signout_btn');

    showError('Signed out.');
}

function signOut() {
    gapi.auth2.getAuthInstance().signOut().then(onSignOut());
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        cookie_policy: 'none',
        scope: SCOPES
    }).then(
        () => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        error => addRowToContainer(JSON.stringify(error, null, 2))
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        onSignIn();
        findFolder();
    } else {
        onSignOut();
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        gapi.auth2.getAuthInstance().currentUser.get()
        onSignIn();
    });
}

/**
 * Print files.
 */
function findFolder(name = 'Expenses') {
    gapi.client.drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name contains '${name}'`,
        pageSize: 50,
        fields: "nextPageToken, files(id, name)"
    }).then(response => {
        const folders = response.result.files;

        if (folders && folders.length > 0) {
            folders.forEach(file => {
                // TODO: handle several folders found
                document.getElementById('folder_name').textContent = file.name + ':';
                listFiles(file.id);
            });
        } else {
            addRowToContainer(`Folder ${name} not found.`);
        }
    });
}

/**
 * List files by folder ID
 */
function listFiles(id) {
    gapi.client.drive.files.list({
        q: `'${id}' in parents`,
        orderBy: 'name desc',
        pageSize: 69,
        fields: "nextPageToken, files(id, name, mimeType)"
    }).then(response => {
            const files = response.result.files;

            if (files && files.length > 0) {
                document.getElementById('content').innerHTML = '';

                files.forEach(file => {
                    if ('application/vnd.google-apps.spreadsheet' === file.mimeType) {
                        addSheetElement(file);
                    } else {
                        addRowToContainer(file.name + ' (' + file.id + ')')
                    }
                });
            } else {
                addRowToContainer(`Folder ${name} not found.`);
            }
        },
        error => addRowToContainer(JSON.stringify(error, null, 2))
    );
}

/**
 * Fetch spreadsheet created from Monthly Budget template and show Expenses table.
 */
function getSheet(spreadsheetId) {
    document.getElementById('expenses').innerHTML = '';
    document.getElementById('expenses').setAttribute('data-id', spreadsheetId);

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: RANGE,
    }).then(
        res => showExpenses(res.result.values),
        err => showError('Error: ' + err.result.error.message)
    );
}

/**
 * Save rows in google spreadsheet:
 *  - first clear (to delete any deleted row and skip original empty rows)
 *  - than save current state.
 */
function updateSheet(spreadsheetId, rows) {
    const valuesApi = gapi.client.sheets.spreadsheets.values,
        params = {
            range: RANGE,
            spreadsheetId: spreadsheetId,
            valueInputOption: 'USER_ENTERED',
            includeValuesInResponse: true,
        },
        valueRangeBody = {
            range: RANGE,
            majorDimension: 'ROWS',
            values: rows,
        }

    valuesApi.clear({
        spreadsheetId: spreadsheetId,
        range: RANGE,
    }).then(
        res => {
            valuesApi.update(params, valueRangeBody).then(
                res => {
                    console.log(res)
                    showInfo('Changes saved!')
                    document.getElementById('expenses').innerHTML = '';
                    showExpenses(res.result.updatedData.values)
                },
                err => showError('Failed to save: ' + err.result.error.message)
            );
        },
        err => showError('Failed to clear range: ' + err.result.error.message)
    )
}
