const API_URL = "https://jsonplaceholder.typicode.com/posts"

let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");//For Adding Quotes
const categoryFilter = document.getElementById("categoryFilter");

//Load from Local Storage
function loadQuotes () {
    const stored = localStorage.getItem("quotes");
    quotes = stored ? JSON.parse(stored) : [
        {text:"The only limit to our realization of tomorrow is our doubts of today.", category:"Motivation"},
    {text:"Lie is what happens when you're busy", category:"Life"},
    {text:"In the middle of every opportunity lies opportunity", category:"Inspiration"}
    ];
}

//Save to Local Storage
function saveQuotes () {
    localStorage.setItem("quotes", JSON.stringify(quotes))
}

//Populate categories on Load (add + filter)
function populateCategories (){
    const categories = [...new set(quotes.map(q => q. category))];

    //Reset dropdowns
    categorySelect.innerHTML="";
    categoryFilter.innerHTML="<option value>";

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

//Filter quotes when drop down
function filterQuotes (){
    const selected = categoryFilter.value;
    localStorage.setItem("selectedCategoryFilter", selected);
    displayRandomQuote();
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

//Export quotes to JSON
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//Import quotes from uploaded JSON file
function importFromJsonFile (event) {
    const fileReader = new FileReader ();
    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format.");
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert ("Quotes imported successfully!");
        } catch (e) {
            alert ("Failed to import quotes: " + e.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

loadQuotes();


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

const showRandomQuote = displayRandomQuote

newQuoteBtn.addEventListener("click", showRandomQuote);

//Populate categories on initial load
populateCategories();

//Restore last quote on session storage
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `"${quote.text}" <br><small>-${quote.category}</small>`
}

//Server Sync Simulation
function fetchFromServer() {
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        const serverQuotes = data.slice(0, 5).map(post => ({
            id: post.id,
            text: post.title,
            category: "Server"
        }));

        let conflicts = 0;
        const ids = new set(quotes.map (q => q.id));

        serverQuotes.forEach(q=>{
            if (!ids.has(q.id)) {
                quotes.push(q); //No conflict
            } else {
                conflicts++;
                quotes = quotes.map(localQ => localQ.id === q.id ? q : localQ);
            }
        });

        if (conflicts > 0) {
            alert (`${conflicts} quotes(s) were updated from the Server (conflict resolved).`)          
        }
        saveQuotes();
        populateCategories();
    })
    .catch(err => console.error("Server sync error:", err));
}
//Auto-sync every 30 seconds
setInterval(fetchFromServer,30000);

//Manual Conflict resoultion button (optional)
function resolveConflictsManually() {
    fetchFromServer(); //Re-trigger manual sync
    alert("Manual sync triggered.")
}