const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Example API (use your own server in production)

// Function to fetch quotes from the server
async function fetchQuotes() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();

    // Assume the response has an array of quotes with text and category properties
    syncQuotes(serverQuotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
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
      // Resolve by updating local quote to match server quote
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
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    console.log('Quote posted to server:', quote);
  } catch (error) {
    console.error('Error posting quote:', error);
  }
}

// Function to periodically sync quotes
function startSyncing() {
  fetchQuotes(); // Initial fetch
  setInterval(fetchQuotes, 60000); // Fetch updates every 60 seconds
}

function notifyUser(message) {
  const notificationElement = document.createElement('div');
  notificationElement.textContent = message;
  notificationElement.className = 'notification';
  document.body.appendChild(notificationElement);

  // Automatically remove after 5 seconds
  setTimeout(() => {
    notificationElement.remove();
  }, 5000);
}

// Call startSyncing when the script loads
startSyncing();

// Other existing code...