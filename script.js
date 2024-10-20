// Initial quotes array
let quotes = [
    { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Inspiration" }
];

// Load quotes from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadQuotes();
    populateCategories();
});

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteDisplay").textContent = quotes[randomIndex].text;
}

// Function to add a new quote
function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newText && newCategory) {
        quotes.push({ text: newText, category: newCategory });
        saveQuotes(); // Save updated quotes to localStorage
        populateCategories(); // Update the categories
        alert("Quote added!");
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = JSON.parse(localStorage.getItem('quotes'));
    if (savedQuotes) {
        quotes = savedQuotes;
    }
}

// Populate the category dropdown dynamically
function populateCategories() {
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    const filter = document.getElementById("categoryFilter");
    filter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filter.appendChild(option);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById("quoteDisplay");
    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.textContent = randomQuote.text;
    } else {
        quoteDisplay.textContent = "No quotes available for this category.";
    }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'quotes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Add event listener to show random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

