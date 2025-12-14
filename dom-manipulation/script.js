const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL for demonstration

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();

    // Map server quotes to save them in the format to match local storage
    const formattedQuotes = serverQuotes.map(quote => ({
      id: quote.id, // Using the id from the mock API
      text: quote.title, // Using title as quote text for demonstration
      category: "default" // Assigning a default category for now
    }));

    // Invoke sync quotes function
    syncQuotes(formattedQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Function to sync quotes between local storage and server
function syncQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const serverQuoteMap = {};
  const conflicts = [];

  // Map server quotes for easy lookup
  serverQuotes.forEach(quote => {
    serverQuoteMap[quote.id] = quote;
  });

  // Check for conflicts and merge updates
  localQuotes.forEach(localQuote => {
    const serverQuote = serverQuoteMap[localQuote.id];
    if (serverQuote) {
      // Conflict resolution: if there's a discrepancy, log the conflict
      if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
        conflicts.push({ localQuote, serverQuote });
      }
    } else {
      // If no server quote matches, add local quote to server's collection
      postQuote(localQuote);
    }
  });

  // Resolve conflicts by taking the server's data
  if (conflicts.length > 0) {
    conflicts.forEach(conflict => {
      console.log('Conflict detected:', conflict);
      // Resolve by updating the local quote to match the server quote
      const index = localQuotes.findIndex(q => q.id === conflict.localQuote.id);
      if (index !== -1) {
        localQuotes[index] = { ...conflict.serverQuote };
        notifyUser('Quote updated from server.');
      }
    });
  }

  // Save updated quotes back to local storage
  localStorage.setItem('quotes', JSON.stringify(localQuotes));
}

// Function to post a new quote to the server
async function postQuote(quote) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8', // Ensure you set the Content-Type header
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Quote posted to server:', quote);
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

// Function to periodically sync quotes
function startSyncing() {
  fetchQuotesFromServer(); // Initial fetch
  setInterval(fetchQuotesFromServer, 60000); // Fetch updates every 60 seconds
}

// Call startSyncing when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  startSyncing(); // Start syncing when the document is ready
  populateCategories(); // Ensure categories are populated
});

// Other existing functions (populateCategories, filterQuotes, notifyUser, etc.) go here...