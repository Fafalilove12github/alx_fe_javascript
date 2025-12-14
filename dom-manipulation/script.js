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
    option.textContent = category;  // Use textContent for adding the category name
    categoryFilter.appendChild(option);
  });

  // Load last selected category from local storage
  const lastSelected = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = lastSelected;
  filterQuotes();  // Call this to display quotes for the selected category
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
      quoteElement.textContent = quote.text; // Use textContent to add text safely
      quoteDisplay.appendChild(quoteElement);
    });
  } else {
    quoteDisplay.textContent = 'No quotes available for this category.'; // Use textContent for the message
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
    option.textContent = newQuote.category; // Use textContent for new category
    categoryFilter.appendChild(option);
  }

  filterQuotes(); // Refresh displayed quotes
}

// Initial population of categories
populateCategories();