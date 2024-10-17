// Array of quote objects
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Be yourself; everyone else is already taken.", category: "Humor" },
    { text: "I'm not lazy, I'm on energy-saving mode.", category: "Humor" },
    // Add more quotes here
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteElement = document.getElementById("quote");
    quoteElement.textContent = randomQuote.text;

    const categoryElement = document.getElementById("category");
    categoryElement.textContent = randomQuote.category;
}

// Function to create the add quote form
function createAddQuoteForm() {
    const form = document.createElement("form");
    form.id = "addQuoteForm";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "quoteText";
    textInput.placeholder = "Enter the quote text";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "quoteCategory";
    categoryInput.placeholder = "Enter the quote category";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Quote";

    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(submitButton);

    const formContainer = document.getElementById("formContainer");
    formContainer.appendChild(form);
}

// Event listener for the form submission
document.getElementById("addQuoteForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const quoteText = document.getElementById("quoteText").value;
    const quoteCategory = document.getElementById("quoteCategory").value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);

        // Clear the form inputs
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategory").value = "";

        // Show a success message (you can customize this)
        alert("Quote added successfully!");
    } else {
        // Show an error message (you can customize this)
        alert("Please enter both quote text and category.");
    }
});

// Initial call to display a random quote
showRandomQuote();

// Initial call to create the add quote form
createAddQuoteForm();