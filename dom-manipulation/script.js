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

  // Extract unique categories
  quotes.forEach(quote => {
    categories.add(quote.category);
  });

  // Clear existing options first (except the first one)
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }

  // Populate dropdown with unique categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastSelected;
  filterQuotes();
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const filteredQuotes = quotes.filter(quote => 
    selectedCategory === 'all' || quote.category === selectedCategory
  );

  if (filteredQuotes.length > 0) {
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('div');
      quoteElement.textContent = quote.text;
      quoteDisplay.appendChild(quoteElement);
    });
  } else {
    quoteDisplay.textContent = 'No quotes available for this category.';
  }
}

// Function to add a quote and update categories
function addQuote(newQuote) {
  quotes.push(newQuote);
  const categoryFilter = document.getElementById('categoryFilter');

  if (![...categoryFilter.options].map(option => option.value).includes(newQuote.category)) {
    const option = document.createElement('option');
    option.value = newQuote.category;
    option.textContent = newQuote.category;
    categoryFilter.appendChild(option);
  }

  filterQuotes();
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear any existing quotes
  const quoteElement = document.createElement('div');
  quoteElement.textContent = randomQuote.text; // Display the random quote
  quoteDisplay.appendChild(quoteElement);
}

// Event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial population of categories
populateCategories();
