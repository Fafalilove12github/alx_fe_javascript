// Array to hold quotes
let quotes = [
  { text: "The early bird catches the worm.", category: "Motivation" },
  { text: "Time is money.", category: "Business" },
  { text: "To be or not to be, that is the question.", category: "Philosophy" }
];

// Function to display a random quote
function showRandomQuote() {
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

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  return formContainer;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// Initialize the add quote form upon loading
document.addEventListener('DOMContentLoaded', () => {
  const formContainer = createAddQuoteForm();
  document.body.appendChild(formContainer);
});

// Adding event listener for showing a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
