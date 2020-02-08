const hideById = (elementId) => {
  const element = document.getElementById(elementId);
  element.classList.add('hidden');
};

const showInfo = (message, isError = false) => {
  document.getElementById('info_message').innerText = message;

  const info = document.getElementById('info');
  info.classList.remove('hidden');

  if (isError) {
    info.classList.add('error');
  } else {
    info.classList.remove('error');
  }

  setTimeout(() => hideById('info'), 2332);
};

const showError = (message) => showInfo(message, true);


const xhrWithAuth = (method, url, callback) => {
  const auth = gapi.auth2.getAuthInstance();

  if (!auth.isSignedIn.get()) {
    showError('Signin required.');
    return callback(new Error('Signin required.'));
  }

  const accessToken = auth.currentUser.get().getAuthResponse().access_token;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      showInfo('Success!');
      const data = JSON.parse(this.responseText);
      console.log(data);
      document.getElementById("expenses").innerText = data.values;
    }
  };

  xhr.send();

};

const getData = () => {
  xhrWithAuth(
      'GET',
      ' https://sheets.googleapis.com/v4/spreadsheets/1VrQGNyyiXOLGlSBUGLhI7SiZz8CRPX5dpqRrwsYc96s/values/Transactions!B3:E69',
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
