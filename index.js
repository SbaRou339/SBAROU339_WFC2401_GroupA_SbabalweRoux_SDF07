// Importing necessary functions from Firebase JavaScript SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Firebase app settings
const appSettings = {
    databaseURL: "https://playground-d68dd-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

// Initializing Firebase app
const app = initializeApp(appSettings)
// Getting reference to the Firebase database
const database = getDatabase(app)
// Reference to the shopping list in the database
const shoppingListInDB = ref(database, "shoppingList")

// DOM element references
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// Event listener for adding items to the shopping list
addButtonEl.addEventListener("click", function() {
    // Retrieve input value
    let inputValue = inputFieldEl.value
    
    // Push input value to the shopping list in the database
    push(shoppingListInDB, inputValue)
    
    // Clear input field
    clearInputFieldEl()
})

// Listener for changes in the shopping list data in the database
onValue(shoppingListInDB, function(snapshot) {
    // Check if data exists in the snapshot
    if (snapshot.exists()) {
        // Convert snapshot data to array
        let itemsArray = Object.entries(snapshot.val())
    
        // Clear the shopping list displayed on the webpage
        clearShoppingListEl()
        
        // Iterate through items array and append them to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        // Display message when shopping list is empty
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Function to clear the shopping list displayed on the webpage
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function to clear the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

// Function to append an item to the shopping list displayed on the webpage
function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    
    // Create a new list item element
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    
    // Add click event listener to delete the item from the database when clicked
    newEl.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action of the click event
        event.stopPropagation(); // Stop the event from propagating to parent elements
        
        // Log deletion of item
        console.log("Deleting item with ID:", itemID);
        
        // Get reference to the exact location of the item in the database and remove it
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });
    
    // Append the new list item to the shopping list
    shoppingListEl.append(newEl);
}

