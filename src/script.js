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

  element.classList.contains('hidden') ? element.classList.remove('hidden') : element.classList.add('hidden');
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

const exploreDrive = () => findFolder(document.getElementById('search_input').value);
