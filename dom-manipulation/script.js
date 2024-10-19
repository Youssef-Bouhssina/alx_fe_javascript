// Array of quote objects with "text", "author", and "category" properties
let storedQuotes = localStorage.getItem("quotes");
let quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats", category: "Determination" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Achievement" }
];

// Server URL for simulation
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
        <p>${randomQuote.text}</p>
        <p>- ${randomQuote.author}</p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// Function to create and display a form for adding quotes
function createAddQuoteForm() {
    const form = document.createElement("form");
    form.id = "addQuoteForm";

    const textInput = createInputField("Enter the quote", "quoteText");
    const authorInput = createInputField("Enter the author", "quoteAuthor");
    const categoryInput = createInputField("Enter the category", "quoteCategory");
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Quote";

    form.appendChild(textInput);
    form.appendChild(authorInput);
    form.appendChild(categoryInput);
    form.appendChild(submitButton);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.appendChild(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        addNewQuote(textInput.value, authorInput.value, categoryInput.value);
        form.reset(); // Clear the form
    });
}

// Helper function to create input fields
function createInputField(placeholder, id) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.id = id;
    return input;
}

// Function to add a new quote and post it to the server
function addNewQuote(text, author, category) {
    if (text && author && category) {
        const newQuote = { text, author, category };
        postQuoteToServer(newQuote);
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to populate categories dynamically
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    categorySelect.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value.toLowerCase();
    const filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(quote => quote.category.toLowerCase() === selectedCategory);
    displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quotesArray) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear current display
    if (quotesArray.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
        return;
    }

    quotesArray.forEach(quote => {
        quoteDisplay.innerHTML += `
            <p>"${quote.text}"</p>
            <p>- ${quote.author}</p>
            <p><em>Category: ${quote.category}</em></p><hr/>
        `;
    });
}

// Function to export quotes as a JSON file
function exportQuotesAsJSON() {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url); // Cleanup
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        displayQuotes(quotes);
        populateCategories();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to fetch quotes from the server
function fetchQuotesFromServer() {
    return fetch(serverUrl)
        .then(response => response.json())
        .then(data => {
            const serverQuotes = data.slice(0, 5).map(post => ({
                text: post.title,
                author: "Server Author",
                category: "Server Category"
            }));
            return serverQuotes;
        })
        .catch(error => {
            console.error("Error fetching quotes from the server:", error);
            return [];
        });
}

// Function to sync local quotes with server quotes
function syncQuotesWithServer() {
    fetchQuotesFromServer().then(serverQuotes => {
        const mergedQuotes = [...quotes];

        // Add server quotes that don't exist in local quotes
        serverQuotes.forEach(serverQuote => {
            if (!quotes.some(quote => quote.text === serverQuote.text && quote.author === serverQuote.author)) {
                mergedQuotes.push(serverQuote);
            }
        });

        // Update quotes array and save to local storage
        quotes.length = 0; // Clear current quotes
        quotes.push(...mergedQuotes);
        saveQuotes();

        displayQuotes(quotes);
        populateCategories();
        console.log("Local quotes synced with server");
    });
}

// Function to periodically fetch and sync quotes with the server
function fetchQuotesPeriodically() {
    setInterval(() => {
        console.log("Checking for updated quotes from the server...");
        syncQuotesWithServer();
    }, 10000); // Fetch every 10 seconds
}

// Post a new quote to the server
function postQuoteToServer(newQuote) {
    fetch(serverUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newQuote.text,
            body: newQuote.author,
            userId: 1
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Quote posted to server:", data);
            quotes.push(newQuote);
            saveQuotes();
            displayQuotes(quotes);
            populateCategories();
        })
        .catch(error => console.error("Error posting quote to server:", error));
}

// Initialize the app
window.onload = function() {
    if (!storedQuotes) {
        syncQuotesWithServer(); // First sync with server if no local data exists
    }
    populateCategories();
    displayQuotes(quotes);
    fetchQuotesPeriodically(); // Start periodic fetching
};

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
