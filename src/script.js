const hideById = (elementId) => {
  document.getElementById(elementId).classList.add('hidden');
};
const showById = (elementId) => {
  document.getElementById(elementId).classList.remove('hidden');
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

  setTimeout(() => hideById('info'), 2369);
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
  const button = document.createElement('button');

  button.classList.add('btn');
  button.textContent =  file.name;
  button.onclick = () => getSheet(file.id);

  container.appendChild(button);
};

const createEditableCell = content => {
  const cell = document.createElement('span');
  cell.setAttribute('contenteditable', 'true');
  cell.textContent = content;

  return cell;
};

const addRowButtons = row => {
  const buttonsCell = document.createElement('div'),
      addButton = document.createElement('button'),
      removeButton = document.createElement('button');

  addButton.classList.add('btn');
  addButton.textContent =  '⊕';
  addButton.onclick = () => addEmptyExpenseRow(row);

  removeButton.classList.add('btn');
  removeButton.textContent =  '⊖';
  removeButton.onclick = () => removeRow(row);

  buttonsCell.classList.add('ctrl');
  buttonsCell.appendChild(addButton);
  buttonsCell.appendChild(removeButton);
  row.appendChild(buttonsCell);
};

const addExpenseRow = (rowColumns, refRow) => {
  const row = document.createElement('div');

  rowColumns.forEach(col => row.appendChild(createEditableCell(col)));
  addRowButtons(row)

  document.getElementById('expenses').insertBefore(row, refRow?.nextSibling);
};

const addEmptyExpenseRow = (refRow) => {
  addExpenseRow(Array(4).fill(''), refRow);
};

const removeRow = row => {
  row.parentNode.removeChild(row);
};

const showExpenses = values => {
  values.forEach(row => row.length && addExpenseRow(row))
  addEmptyExpenseRow()
  showById('expenses_ctrl')
};

/**
 * Parse current table data back to values range, skip empty rows.
 */
const parseSheetToValues = sheetName => {
  const rows = [];

  document.getElementById(sheetName).childNodes.forEach(row => {
    const rowItem = [];
    row.childNodes.forEach(cell => cell.textContent && rowItem.push(cell.textContent))
    rowItem.length > 1 && rows.push(rowItem.slice(0, -1))
  })

  return rows;
};

const saveCurrentSheet = (sheetName) => updateSheet(
  document.getElementById(sheetName).getAttribute('data-id'),
  parseSheetToValues(sheetName)
);
