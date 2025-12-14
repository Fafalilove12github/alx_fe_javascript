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

// Function to create the add quote form and buttons
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
  exportButton.addEventListener('click', exportQuotes);  // Ensure this function exists

  const importInput = document.createElement('input');
  importInput.id = 'importFile';
  importInput.type = 'file';
  importInput.accept = '.json';
  importInput.onchange = importFromJsonFile;  // Ensure this function exists

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  formContainer.appendChild(exportButton);
  formContainer.appendChild(importInput);

  document.getElementById('formContainer').appendChild(formContainer); // Append to formContainer
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
  const jsonString = JSON.stringify(quotes, null, 2);
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
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    } catch (error) {
      alert('Failed to import quotes. Please ensure the file is a valid JSON.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the add quote form and load quotes on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes(); // Load existing quotes from local storage
  showRandomQuote(); // Display a random quote if available
  createAddQuoteForm(); // Create and display the add quote form
});

// Event listener for showing a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
// Sample quotes array
const quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "inspiration" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", category: "humor" },
  { text: "So many books, so little time.", category: "reading" },
  // Add more quotes as needed...
];

// Function to populate the categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = new Set();

  // Get unique categories
  quotes.forEach(quote => {
    categories.add(quote.category);
  });

  // Populate dropdown with categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.innerText = category;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastSelected;
  filterQuotes();
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory); // Store selected category in local storage

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear existing quotes

  // Filter quotes based on selected category
  const filteredQuotes = quotes.filter(quote => 
    selectedCategory === 'all' || quote.category === selectedCategory
  );

  // Display filtered quotes
  if (filteredQuotes.length > 0) {
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('div');
      quoteElement.innerText = quote.text;
      quoteDisplay.appendChild(quoteElement);
    });
  } else {
    quoteDisplay.innerText = 'No quotes available for this category.';
  }
}

// Function to add a quote and update categories
function addQuote(newQuote) {
  quotes.push(newQuote);
  const categoryFilter = document.getElementById('categoryFilter');

  // Add new category to the dropdown if it doesn't exist
  if (![...categoryFilter.options].map(option => option.value).includes(newQuote.category)) {
    const option = document.createElement('option');
    option.value = newQuote.category;
    option.innerText = newQuote.category;
    categoryFilter.appendChild(option);
  }

  filterQuotes(); // Refresh displayed quotes
}

// Initial population of categories
populateCategories();