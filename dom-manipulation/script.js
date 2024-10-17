// Array of quote objects with "text", "author", and "category" properties
const quotes = [
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

            // Remove the form and display the new quote
            form.remove();
            showRandomQuote();
        }
    });
}

// Show the form immediately when the page loads
createAddQuoteForm();

// Initial quote display
showRandomQuote();

// Event listener for the "Show New Quote" button
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);
