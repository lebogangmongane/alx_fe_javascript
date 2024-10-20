const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from server
async function fetchQuotesFromServer() {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes.slice(0, 5); // Example limit
}

// Post a new quote to server
async function postQuoteToServer(quote) {
    const response = await fetch(serverUrl, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    return await response.json();
}

// Sync local quotes with server
async function syncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: Server data overwrites local data
    quotes = serverQuotes;

    // Save the updated quotes to local storage
    saveQuotes();

    alert('Data synchronized with server (server takes precedence)');
}

// Periodic sync every 60 seconds
setInterval(syncWithServer, 60000);

// Post new quote and sync with server
async function addQuote() {
    const quote = { text: 'New Quote', category: 'Motivation' };
    quotes.push(quote);
    saveQuotes(); // Save locally
    await postQuoteToServer(quote); // Post to server
    alert('New quote added and synced with server!');
}
