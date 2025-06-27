const quotes = [
    {text:"The only limit to our realization of tomorrow is our doubts of today.", category:"Motivation"},
    {text:"Lie is what happens when you're busy", category:"Life"},
    {text:"In the middle of every opportunity lies opportunity", category:"Inspiration"}
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

//Populate categories on Load
function populateCategories (){
    const categories = [...new set(quotes.map(q => q. category))];
    categories.forEach(cat => {
        if (![...categorySelect.options].some(option => option.value === cat)) {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        }
    });
}

//Show a random quote based on selected category
function displayRandomQuote () {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available in this category.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" <br><small>-${quote.category}</small>`;

}

//Add a new quote from input
function addQuote () {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if(!quoteText || !quoteCategory) {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({text:quoteText, category: quoteCategory});

    //clear inputs
    document.getElementById("newQuoteText").value ="";
    document.getElementById("newQuoteCategory").value="";

    populateCategories();
    alert("Quote added successfully")
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

createAddQuoteForm();

newQuoteBtn.addEventListener("click", displayRandomQuote);

//Populate categories on initial load
populateCategories();