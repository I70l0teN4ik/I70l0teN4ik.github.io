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

const exploreDrive = () => {
  const input = document.getElementById('search_input');

  findFolder(input.value);
  input.value = '';
};


/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 */
const addRowToContainer = (message, containerId = 'content', tagName = null, attributes = []) => {
  const container = document.getElementById(containerId);
  let node;

  if (tagName) {
    node = document.createElement(tagName);
    node.innerText = message;

    attributes.forEach(attr => node.setAttribute(...attr));
  } else {
    node = document.createTextNode(message + '\n');
  }

  container.appendChild(node);
};

const addSheetElement = file => {
  const container = document.getElementById('content');
  const button = document.createElement('span');

  button.classList.add('btn');
  button.textContent =  file.name;
  button.onclick = () => getSheet(file.id);

  container.appendChild(button);
};

const addExpenseRow = rowColumns => {
  const container = document.getElementById('expenses');
  const row = document.createElement('div');

  rowColumns.forEach(col => {
    const column = document.createElement('span');
    column.setAttribute('contenteditable', 'true');
    column.textContent = col;

    row.appendChild(column);
  });

  container.appendChild(row);
};