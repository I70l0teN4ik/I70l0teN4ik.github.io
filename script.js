const hideById = (elementId) => {
  const element = document.getElementById(elementId);
  console.log('hide ' + elementId, element);
  element.classList.add('hidden');
};
const showById = (elementId) => {
  const element = document.getElementById(elementId);
  console.log('show ' + elementId, element);
  element.classList.remove('hidden');
};

const toggleHidden = (elementId) => {
  const element = document.getElementById(elementId);

  if (element.classList.contains('hidden')) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
};

const showInfo = (message, isError = false) => {
  document.getElementById('info_message').innerText = message;

  const info = document.getElementById('info');

  if (isError) {
    info.classList.add('error');
  } else {
    info.classList.remove('error');
  }

  info.classList.remove('hidden');

  setTimeout(() => hideById('info'), 6996);
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


