const brawlers = [
    "Juju", "Shade", "Kenji", "Moe", "Clancy", "Berry", "Lily", "Draco", "Angelo", 
    "Melodie", "Larry & Lawrie", "Kit", "Mico", "Charlie", "Chuck", "Pearl", "Doug", 
    "Cordelius", "Hank", "Maisie", "Willow", "R-T", "Mandy", "Gray", "Chester", 
    "Buster", "Gus", "Sam", "Otis", "Bonnie", "Janet", "Eve", "Fang", "Lola", "Meg", 
    "Ash", "Griff", "Buzz", "Grom", "Squeak", "Belle", "Stu", "Ruffs", "Edgar", 
    "Byron", "Lou", "Amber", "Colette", "Surge", "Sprout", "Nani", "Gale", "Jacky", 
    "Max", "Mr. P", "Emz", "Bea", "Sandy", "8-Bit", "Bibi", "Carl", "Rosa", "Leon", 
    "Tick", "Gene", "Frank", "Penny", "Darryl", "Tara", "Pam", "Piper", "Bo", "Poco", 
    "Crow", "Mortis", "El Primo", "Dynamike", "Nita", "Jessie", "Barley", "Spike", 
    "Rico", "Brock", "Bull", "Colt", "Shelly"
];
  
// const answer = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
const answer = 'darryl'
  
const inputField = document.getElementById('field');
const guessForm = document.getElementById('guess');
const flipDelay = 450;
let flipCount = 0;

const suggestionList = document.createElement('ul');
suggestionList.id = 'suggestion-list';
suggestionList.style.position = 'absolute';
suggestionList.style.display = 'none';
suggestionList.style.listStyleType = 'none';
suggestionList.style.margin = '0';
suggestionList.style.padding = '0';
suggestionList.style.backgroundColor = '#fff';
suggestionList.style.border = '1px solid #ccc';
suggestionList.style.borderRadius = '0.25em';
suggestionList.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

document.body.appendChild(suggestionList);

let currentIndex = -1;  // To keep track of which suggestion is highlighted

inputField.addEventListener('input', function() {
    const query = inputField.value.toLowerCase();
    suggestionList.innerHTML = '';
  
    if (query) {
        const filteredSuggestions = brawlers.filter(suggestion => suggestion.toLowerCase().includes(query));
        filteredSuggestions.forEach((suggestion, index) => {
            const listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.alignItems = 'center';
            listItem.style.padding = '0.5rem';
            listItem.style.cursor = 'pointer';
            listItem.style.borderBottom = '0.13em solid #00000050';

            const pinImage = document.createElement('img');
            pinImage.src = `assets/pins/${suggestion.toLowerCase()}_pin.png`;
            pinImage.alt = `${suggestion} Pin`;
            pinImage.style.width = '2.5rem';
            pinImage.style.marginRight = '0.5em'; // Spacing between image and text

            listItem.appendChild(pinImage);
            listItem.appendChild(document.createTextNode(suggestion));

            listItem.addEventListener('click', () => {
                inputField.value = suggestion;
                suggestionList.style.display = 'none';  // Hide the suggestion list
                handleFormSubmit(suggestion);
            });
            suggestionList.appendChild(listItem);
        });
  
        if (filteredSuggestions.length > 0) {
            suggestionList.style.display = 'block';  // Show the suggestion list
            positionSuggestionList();
        } else {
            suggestionList.style.display = 'none';  // Hide if no matches
        }
    } else {
        suggestionList.style.display = 'none';  // Hide if input is empty
    }
});


  
inputField.addEventListener('keydown', function(e) {
    const items = suggestionList.querySelectorAll('li');
    if (e.key === 'ArrowDown') {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateHighlightedItem(items);
        }
    } else if (e.key === 'ArrowUp') {
        if (currentIndex > 0) {
            currentIndex--;
            updateHighlightedItem(items);
        }
    }  else if (e.key === 'Enter') {
        if (inputField.value.toLowerCase() in data) {
            if (currentIndex >= 0) {
                inputField.value = items[currentIndex].textContent;
            } else if (items.length > 0) {
                inputField.value = items[0].textContent; // Default to the first suggestion
            }
            suggestionList.style.display = 'none';
            handleFormSubmit(inputField.value); 
            currentIndex = -1;
            e.preventDefault();
        }
    }
});

function updateHighlightedItem(items) {
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.style.backgroundColor = '#f0f0f0';
        } else {
            item.style.backgroundColor = '';
        }
    });
}

function positionSuggestionList() {
    const rect = inputField.getBoundingClientRect();
    suggestionList.style.left = `${rect.left}px`;
    suggestionList.style.top = `${rect.bottom}px`;
    suggestionList.style.width = `${rect.width}px`;
}

// Hide suggestion list if clicked outside
document.addEventListener('click', (e) => {
    if (!suggestionList.contains(e.target) && e.target !== inputField) {
        suggestionList.style.display = 'none';
    }
});

guessForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const items = suggestionList.querySelectorAll('li');

    if (items.length > 0) {
        // Use the top suggestion if it exists
        inputField.value = items[0].textContent;
    }

    const inputValue = inputField.value.trim();
    if (inputValue && inputValue.toLowerCase() in data) {
        handleFormSubmit(inputValue);
    }

    if (inputValue.toLowerCase() in data)
        inputField.value = '';
    suggestionList.style.display = 'none'; // Hide suggestions
});

function handleFormSubmit(brawlerName) {
    if (flipCount > 0) return;

    console.log(`Submitted Brawler: ${brawlerName}`);
    const guess = inputField.value.trim().toLowerCase();
    const brawler = data[brawlerName.toLowerCase()];
    const columns = ["brawler", "rarity", "class", "movement", "range", "reload", "released"];

    inputField.style.pointerEvents = 'none'; // disable input without visually changing it
    guessForm.querySelector('button').disabled = true;

    // Add headers if none exist
    if (document.querySelectorAll("#grid .seperator").length === 0 && brawler) {
        columns.forEach(col => {
            const columnElement = document.getElementById(`${col}_column`);
            columnElement.innerHTML = `${col.charAt(0).toUpperCase() + col.slice(1)}<div class="seperator"></div>`;
        });
    }

    // Create elements dynamically
    const createSquare = (key, delay) => {
        const value = data[guess][key];
        const square = document.createElement("div");
        square.classList.add("square", "flip");
        square.innerHTML = String(value);
        square.style.animationDelay = `${flipDelay * (delay || 0)}ms`; // first card has no delay

        square.addEventListener("animationstart", () => {
            flipCount++;  // Increment when flip starts
        });

        // Decrement flip count when animation ends
        square.addEventListener("animationend", () => {
            flipCount--;  // Decrement when flip ends

            // Check if all flips are finished
            if (flipCount === 0) {
                inputField.style.pointerEvents = 'auto';  // Re-enable input field
                guessForm.querySelector('button').disabled = false;  // Re-enable submit button
            }
        });

        if (key === "released") {
            const comparison = Number(data[guess][key]) - Number(data[answer][key]);
            square.classList.add(comparison === 0 ? "green" : comparison > 0 ? "down" : "up");
        } else {
            square.classList.add(data[guess][key] === data[answer][key] ? "green" : "red");
        }

        // WIN condition
        if (key === "released") {
            const allCorrect = columns.every(col => {
                return col === "released" || data[guess][col] === data[answer][col];
            });

            if (allCorrect) {
                square.addEventListener("animationend", () => {
                    triggerWinAnimation(); // wait until last card gets flipped
                });
            }
        }

        return square;
    };

    // Insert squares into columns
    columns.forEach((col, i) => {
        const column = document.getElementById(`${col}_column`);
        const element = col === "brawler" 
            ? (() => {
                const portrait = document.createElement("div");
                portrait.classList.add("square", "portrait");
                portrait.style.backgroundImage = `url("assets/portraits/${brawlerName.toLowerCase()}_portrait.png")`;
                return portrait;
            })()
            : createSquare(col, i);

        column.insertBefore(element, column.children[1]);
    });

    // Clear input if valid brawler
    if (brawler) inputField.value = '';
}

function triggerWinAnimation() {
    triggetConfetti();
}