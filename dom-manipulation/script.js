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

function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
    const categoryDropdown = document.getElementById("categoryDropdown"); // Assuming this is your dropdown's ID

    // Clear any existing options
    categoryDropdown.innerHTML = "";

    // Create a default "Select a category" option
    const defaultOption = document.createElement("option");
    defaultOption.text = "Select a category";
    defaultOption.value = "";
    categoryDropdown.appendChild(defaultOption);

    // Populate dropdown with categories
    categories.forEach(category => {
        const option = document.createElement("option");
        option.text = category;
        option.value = category;
        categoryDropdown.appendChild(option);
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

// Show the form immediately when the page loads
createAddQuoteForm();

// Initial quote display
showRandomQuote();

// Event listener for the "Show New Quote" button
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);
