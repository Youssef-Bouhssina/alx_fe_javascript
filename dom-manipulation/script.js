// Array of quote objects with "text", "author", and "category" properties
const storedQuotes = localStorage.getItem("quotes");
let quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats", category: "Determination" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Achievement" },
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p>- ${randomQuote.author}</p>
    <p><em>Category: ${randomQuote.category}</em></p>
  `;
}

// Function to create and display a form for adding quotes
function createAddQuoteForm() {
    const form = document.createElement("form");
    form.id = "addQuoteForm";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = "Enter the quote";
    textInput.name = "quoteText";

    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.placeholder = "Enter the author";
    authorInput.name = "quoteAuthor";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter the category";
    categoryInput.name = "quoteCategory";

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

        const quoteText = textInput.value;
        const quoteAuthor = authorInput.value;
        const quoteCategory = categoryInput.value;

        if (quoteText && quoteAuthor && quoteCategory) {
            const newQuote = { text: quoteText, author: quoteAuthor, category: quoteCategory };
            quotes.push(newQuote);

            localStorage.setItem("quotes", JSON.stringify(quotes));

            form.remove();
            showRandomQuote();
            populateCategories(); // Update categories after adding a new quote
        }
    });
}

// Function to populate categories dynamically
function populateCategories() {
    const categorySelect = document.getElementById("categoryFilter");
    categorySelect.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.toLowerCase();
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value.toLowerCase();

    let filteredQuotes;
    if (selectedCategory === "all") {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory);
    }

    displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quotesArray) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear display

    if (quotesArray.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
        return;
    }

    quotesArray.forEach(quote => {
        quoteDisplay.innerHTML += `
            <p>"${quote.text}"</p>
            <p>- ${quote.author}</p>
            <p><em>Category: ${quote.category}</em></p>
            <hr/>
        `;
    });
}

// Function to export quotes as a JSON file
function exportQuotesAsJSON() {
    const json = JSON.stringify(quotes, null, 2); // Pretty print with 2 spaces indentation
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json"; // Filename for the download
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        alert('Quotes imported successfully!');
        populateCategories(); // Update categories after importing quotes
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulated server endpoint
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to sync quotes between local and server
async function syncQuotes() {
    try {
        const response = await fetch(serverUrl);
        const data = await response.json();

        const serverQuotes = data.slice(0, 5).map(post => ({
            text: post.title,
            author: "Server Author",
            category: "Server Category"
        }));

        // Check for conflicts and notify user
        checkForConflicts(serverQuotes);
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
}

// Function to fetch quotes from the server using async/await
async function fetchQuotesFromServer() {
    await syncQuotes(); // Call syncQuotes to update from server
}

// Function to check for conflicts
function checkForConflicts(serverQuotes) {
    const updatedQuotes = [];

    serverQuotes.forEach(serverQuote => {
        const localQuote = quotes.find(quote => quote.text === serverQuote.text);

        if (localQuote) {
            // Conflict found
            showConflictNotification(serverQuote, localQuote);
        } else {
            updatedQuotes.push(serverQuote);
        }
    });

    // Update local quotes if no conflicts or resolved
    quotes = [...quotes, ...updatedQuotes];
    displayQuotes(quotes);
    populateCategories(); // Update categories dropdown
}

// Function to show conflict notification and resolve options
function showConflictNotification(serverQuote, localQuote) {
    const notification = document.getElementById("notification");
    notification.innerHTML = `
        <p>Conflict detected for quote: "${localQuote.text}"</p>
        <p>Server Quote: "${serverQuote.text}"</p>
        <button onclick="resolveConflict('${localQuote.text}', 'keep')">Keep Local</button>
        <button onclick="resolveConflict('${localQuote.text}', 'update')">Update to Server</button>
    `;
}

// Function to resolve conflict based on user choice
function resolveConflict(quoteText, choice) {
    const localQuote = quotes.find(quote => quote.text === quoteText);
    const serverQuote = { text: "Updated Server Quote", author: "Server Author", category: "Server Category" }; // Mock server quote

    if (choice === 'keep') {
        // Keep local quote, do nothing
        console.log("Kept local quote:", localQuote);
    } else if (choice === 'update') {
        // Update local quote with server quote
        const index = quotes.indexOf(localQuote);
        quotes[index] = serverQuote;
        console.log("Updated to server quote:", serverQuote);
    }

    // Clear the notification after resolving
    document.getElementById("notification").innerHTML = '';
    displayQuotes(quotes);
    populateCategories(); // Update categories dropdown
}

// Post a new quote to the server using async/await
async function postQuoteToServer(newQuote) {
    try {
        const response = await fetch(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newQuote.text,
                body: newQuote.author,
                userId: 1 // Placeholder
            })
        });

        const data = await response.json();
        console.log("Quote posted to server:", data);
        quotes.push(newQuote);
        displayQuotes(quotes);
        populateCategories(); // Update categories dropdown

    } catch (error) {
        console.error("
