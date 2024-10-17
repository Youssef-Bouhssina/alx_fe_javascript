// Array of quote objects
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Live life to the fullest and focus on the positive.", author: "Unknown" },
    // Add more quotes here
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
    <p>${randomQuote.text}</p>
    <p>- ${randomQuote.author}</p>
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

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Quote";

    form.appendChild(textInput);
    form.appendChild(authorInput);
    form.appendChild(submitButton);

    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.appendChild(form);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const quoteText = textInput.value;
        const quoteAuthor = authorInput.value;

        if (quoteText && quoteAuthor) {
            const newQuote = { text: quoteText, author: quoteAuthor };
            quotes.push(newQuote);

            // Remove the form and display the new quote
            form.remove();
            showRandomQuote();
        }
    });
}

// Initial quote display
showRandomQuote();

// Event listener for the "Show New Quote" button
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);

// Event listener for the "Add Quote" button (if you want to trigger it manually)
// const addQuoteButton = document.getElementById("addQuoteButton"); // If you have this button
// addQuoteButton.addEventListener("click", createAddQuoteForm);