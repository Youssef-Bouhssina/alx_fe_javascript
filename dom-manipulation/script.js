// Array of quote objects with "text", "author", and "category" properties
const storedQuotes = localStorage.getItem("quotes");
const quotes = storedQuotes ? JSON.parse(storedQuotes) : [
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
    <p>${randomQuote.text}</p>
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

            // Remove the form and display the new quote
            form.remove();
            showRandomQuote();
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
    const selectedCategory = document.getElementById("categoryFilter").value.toLowerCase(); // Get selected category

    let filteredQuotes;
    if (selectedCategory === "all") {
        filteredQuotes = quotes; // Show all quotes if "all" is selected
    } else {
        filteredQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory); // Filter by category
    }

    displayQuotes(filteredQuotes); // Display filtered quotes
}

// Function to display quotes
function displayQuotes(quotesArray) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear current display

    if (quotesArray.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>"; // Display message if no quotes match
        return;
    }

    quotesArray.forEach(quote => {
        quoteDisplay.innerHTML += `
            <p>"${quote.text}"</p>
            <p>- ${quote.author}</p>
            <p><em>Category: ${quote.category}</em></p>`;
    });
}

// Call populateCategories on page load to populate dropdown
window.onload = function() {
    populateCategories();
};


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

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Simulated server endpoint
const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from the server
function fetchQuotesFromServer() {
    fetch(serverUrl)
        .then(response => response.json())
        .then(data => {
            quotes = data.slice(0, 5).map(post => ({
                text: post.title,
                author: "Server Author",
                category: "Server Category"
            }));

            displayQuotes(quotes);
            populateCategories(); // Update categories dropdown
        })
        .catch(error => console.error("Error fetching quotes from server:", error));
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
            userId: 1 // Placeholder
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Quote posted to server:", data);
            quotes.push(newQuote);
            displayQuotes(quotes);
            populateCategories(); // Update categories dropdown
        })
        .catch(error => console.error("Error posting quote to server:", error));
}

// Add quote and post to server
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteAuthor = document.getElementById("newQuoteAuthor").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText && quoteAuthor && quoteCategory) {
        const newQuote = { text: quoteText, author: quoteAuthor, category: quoteCategory };
        postQuoteToServer(newQuote);
    }
}

// Function to periodically fetch quotes from the server
function fetchQuotesPeriodically() {
    setInterval(() => {
        console.log("Fetching updated quotes from the server...");
        fetch(serverUrl)
            .then(response => response.json())
            .then(data => {
                const updatedQuotes = data.slice(5, 10).map(post => ({
                    text: post.title,
                    author: "Updated Server Author",
                    category: "Updated Category"
                }));

                quotes = updatedQuotes;
                displayQuotes(quotes);
                populateCategories(); // Update categories dropdown
            })
            .catch(error => console.error("Error fetching periodic updates:", error));
    }, 10000); // Every 10 seconds
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

// Populate categories dynamically
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

// Initial data fetch and periodic updates
window.onload = function() {
    fetchQuotesFromServer();
    populateCategories();
    fetchQuotesPeriodically();
};

// Show the form immediately when the page loads
createAddQuoteForm();

// Initial quote display
showRandomQuote();

// Event listener for the "Show New Quote" button
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);
