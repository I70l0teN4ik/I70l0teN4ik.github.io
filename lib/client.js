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

function onSignIn() {
    showInfo('Signed in.');

    const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

    document.getElementById('profile_name').innerText = profile.getName();
    document.getElementById('profile_email').innerText = profile.getEmail();
    document.getElementById('profile_img').setAttribute('src', profile.getImageUrl());
    showById('profile_img');
    hideById('signin_btn');
    showById('signout_btn');
}

function onSignOut() {
    showError('Signed out.');

    document.getElementById('profile_name').innerText = null;
    document.getElementById('profile_email').innerText = null;
    document.getElementById('profile_img').setAttribute('src', null);
    hideById('profile_img');
    showById('signin_btn');
    hideById('signout_btn');

    console.log('User signed out.');
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
        scope: SCOPES
    }).then(function () {
        // Handle the initial sign-in state.
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        addRowToContainer(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        onSignIn();
        listFiles();
        getSheet();
    } else {
        onSignOut();
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn().then(onSignIn());
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function addRowToContainer(message, containerId = 'content') {
    const container = document.getElementById(containerId);
    const textContent = document.createTextNode(message + '\n');
    container.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
    gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and name='Expenses'",
        pageSize: 50,
        fields: "nextPageToken, files(id, name)"
    }).then(function(response) {
        console.log(response);
        addRowToContainer('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                addRowToContainer(file.name + ' (' + file.id + ')');
            }
        } else {
            addRowToContainer('No files found.');
        }
    });
}


/**
 * Print Expenses.
 */
function getSheet(spreadsheetId = '1VrQGNyyiXOLGlSBUGLhI7SiZz8CRPX5dpqRrwsYc96s') {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Transactions!B3:E69',
    }).then(res => {
        // showInfo('Found Expenses!');
        console.log(res);
        res.result.values.forEach(row => row.length && addRowToContainer(row, 'expenses'));
    }, err => showError('Error: ' + err.result.error.message));
}