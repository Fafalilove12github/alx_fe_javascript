// Array to hold quotes
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `<p>${quote.text}</p><p><em>(${quote.category})</em></p>`;
}

// Function to create the add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.innerText = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  const exportButton = document.createElement('button');
  exportButton.innerText = 'Export Quotes';
  exportButton.addEventListener('click', exportQuotes);

  const importInput = document.createElement('input');
  importInput.id = 'importFile';
  importInput.type = 'file';
  importInput.accept = '.json';
  importInput.onchange = importFromJsonFile;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  formContainer.appendChild(exportButton);
  formContainer.appendChild(importInput);

  return formContainer;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes(); // Save quotes after adding a new one
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const jsonString = JSON.stringify(quotes);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save the updated quotes to local storage
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the add quote form and load quotes on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes(); // Load existing quotes from local storage
  showRandomQuote(); // Display a random quote if available
  const formContainer = createAddQuoteForm();
  document.body.appendChild(formContainer);
});

// Adding event listener for showing a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
