let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// Fetch quotes from an external server (using async/await and a real API)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();

    // Simulate extracting quotes and categories from the server data (using title as text)
    const fetchedQuotes = serverQuotes.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server Category"
    }));

    // Add the fetched quotes to the existing array
    quotes.push(...fetchedQuotes);
    console.log('Quotes fetched from server:', fetchedQuotes);

    // Save to local storage
    syncQuotes(); // Ensure local storage is in sync after fetching new quotes
    populateCategories();
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Function to send a new quote to the server (POST request)
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log('Quote sent to server:', result);
  } catch (error) {
    console.error("Error sending quote to server:", error);
  }
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = randomQuote.text;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  syncQuotes(); // Sync quotes to local storage after adding a new one
  populateCategories();
  alert("New quote added!");

  // Send the new quote to the server (POST request)
  sendQuoteToServer(newQuote);

  // Clear input fields
  document.getElementById('newQuoteText').value = "";
  document.getElementById('newQuoteCategory').value = "";
}

// Function to populate the category filter dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');

  // Clear current options except 'All Categories'
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = randomQuote.text;
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Function to sync quotes with local storage and notify user
function syncQuotes() {
  saveQuotes(); // Save the current quotes to local storage
  alert("Quotes synced with server!"); // Notify the user
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  
  // The readAsText method is used here to read the content of the file
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    syncQuotes(); // Sync quotes after importing
    populateCategories();
    alert('Quotes imported successfully!');
  };

  // Use readAsText to read the content of the file selected by the user
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for showing a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Load quotes from local storage when the page loads
window.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();

  // Set interval to show a new random quote every 5 seconds
  setInterval(showRandomQuote, 5000);
});

// Fetch quotes from the simulated server
fetchQuotesFromServer();
