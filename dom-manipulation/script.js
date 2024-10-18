// Array of quote objects with "text", "author", and "category" properties
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", category: "Perseverance" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs", category: "Inspiration" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats", category: "Determination" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Achievement" },
];

// Cache the DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to display a random quote
function showRandomQuote() {
    const { text, author, category } = quotes[Math.floor(Math.random() * quotes.length)];
    
    quoteDisplay.innerHTML = `
        <p>${text}</p>
        <p>- ${author}</p>
        <p><em>Category: ${category}</em></p>
    `;
}

// Utility function to create input fields
function createInput(placeholder, name) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.name = name;
    return input;
}

// Function to create and display a form for adding quotes
function createAddQuoteForm() {
    const form = document.createElement("form");
    form.id = "addQuoteForm";

    const textInput = createInput("Enter the quote", "quoteText");
    const authorInput = createInput("Enter the author", "quoteAuthor");
    const categoryInput = createInput("Enter the category", "quoteCategory");

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Quote";

    form.append(textInput, authorInput, categoryInput, submitButton);
    quoteDisplay.appendChild(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const { quoteText, quoteAuthor, quoteCategory } = form.elements;

        if (quoteText.value && quoteAuthor.value && quoteCategory.value) {
            quotes.push({
                text: quoteText.value,
                author: quoteAuthor.value,
                category: quoteCategory.value
            });

            form.remove();
            showRandomQuote();
        }
    });
}

// Initialize the form and show an initial quote
createAddQuoteForm();
showRandomQuote();

// Event listener for the "Show New Quote" button
newQuoteButton.addEventListener("click", showRandomQuote);
