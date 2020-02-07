const hideById = (elementId) => {
  const element = document.getElementById(elementId);
  element.classList.add('hidden');
};


const xhrWithAuth = (method, url, callback) => {
  var auth = gapi.auth2.getAuthInstance();

  if (!auth.isSignedIn.get()) {
    return callback(new Error('Signin required.'));
  }
  var accessToken = auth.currentUser.get().getAuthResponse().access_token;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  xhr.onload = callback(null, this.status, this.response);
  xhr.send();

};

const getData = () => {
  xhrWithAuth(
      'GET',
      ' https://sheets.googleapis.com/v4/spreadsheets/1VrQGNyyiXOLGlSBUGLhI7SiZz8CRPX5dpqRrwsYc96s/values/Transactions!A3:E69',
      (res) => {console.log(res)}
  );
};


// TODO: Add Google Sign-in.
function onSignIn(user) {
  const profile = user.getBasicProfile();
  console.log(profile);
  // The ID token you need to pass to your backend:
  // accessToken = user.getAuthResponse().id_token;

  document.getElementById('profile_name').innerText = profile.getName();
  document.getElementById('profile_email').innerText = profile.getEmail();


  getData();
}