const yesterday_answer = 'brock'

const answer = localStorage.getItem('answer') || Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)];
let guessedBrawlers = JSON.parse(localStorage.getItem('guesses')) || [];
let alreadyWon = localStorage.getItem('won') || false

localStorage.setItem('answer', answer)
console.log(answer)
  
const inputField = document.getElementById('field');
const guessForm = document.getElementById('guess');
const flipDelay = 450;
const winScrollDelay = 1500;
let flipCount = 0;

const suggestionList = document.createElement('ul'); // there is probably a more concise way to do this but I everytime I try it it breaks
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

const yesterday_icon = document.getElementById('yesterday-icon')
yesterday_icon.src=`assets/pins/${yesterday_answer.toLowerCase()}_pin.png`;

const yesterday_name = document.getElementById('yesterday-name')
yesterday_name.innerHTML=yesterday_answer[0].toUpperCase()+yesterday_answer.slice(1)

document.body.appendChild(suggestionList);

let currentIndex = -1;  // To keep track of which suggestion is highlighted

function saveGuess(brawlerName) {
    guessedBrawlers.push(brawlerName);
    localStorage.setItem('guesses', JSON.stringify(guessedBrawlers));
}

function loadPreviousGame() {
    guessedBrawlers.forEach(guess => {
        displayGuess(data[guess], guess);
    });
    if(alreadyWon) {
        let win_info = document.getElementById('win-info');
        displayWin();
        win_info.style.opacity = '1';
        win_info.style.margin = '3em auto';
        win_info.classList.remove('hidden');
    }
}

inputField.addEventListener('input', function() {
    const query = inputField.value.toLowerCase();
    suggestionList.innerHTML = '';
  
    if (query) {
        // Don't include already guessed brawlers
        const filteredSuggestions = brawlers.filter(suggestion => 
            suggestion.toLowerCase().includes(query) && !guessedBrawlers.includes(suggestion.toLowerCase())
        );

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
        if (currentIndex >= 0 && items.length > 0 && !(guessedBrawlers.includes(inputField.value.toLowerCase()))) {
            // Get the highlighted suggestion
            const highlightedSuggestion = items[currentIndex].textContent.trim();
            inputField.value = highlightedSuggestion;  // Update input field with selected suggestion
            suggestionList.style.display = 'none';  // Hide suggestion list
            handleFormSubmit(highlightedSuggestion);  // Call handleFormSubmit with the highlighted suggestion
            currentIndex = -1;  // Reset currentIndex after submitting
            e.preventDefault();  // Prevent form submission
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
    suggestionList.style.position = 'fixed'; // Ensures consistent placement
    suggestionList.style.left = `${rect.left}px`;
    suggestionList.style.top = `${rect.bottom}px`;
    suggestionList.style.width = `${rect.width}px`;
}

// Recalculate position on input, window resize, or scroll
inputField.addEventListener('input', positionSuggestionList);
window.addEventListener('resize', positionSuggestionList);
window.addEventListener('scroll', positionSuggestionList);

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
    if (inputValue && inputValue.toLowerCase() in data && !(guessedBrawlers.includes(inputValue.toLowerCase()))) {
        inputField.value = '';
        handleFormSubmit(inputValue);
    }

    suggestionList.style.display = 'none'; // Hide suggestions
});

function displayGuess(brawler, brawlerName) {
    const categories = ["brawler", "rarity", "class", "movement", "range", "reload", "released"];
    const correct_categories = categories.map(category => brawler[category] === data[answer][category]);
    
    let list = document.getElementById('list');
    let row = document.createElement('div');
    row.classList.add('row');

    categories.forEach((category, index) => {
        let square = document.createElement('div');
        square.classList.add('square', 'stroke');
    
        if (category === "brawler") {
            square.classList.add("portrait");
            square.style.backgroundImage = `url("assets/portraits/${brawlerName}_portrait.png")`;
        } else {
            square.innerHTML = brawler[category];
            square.classList.add('flip')
            square.style.animationDelay =  `${flipDelay*index}ms`;
            if (category === "released") {
                const releasedDiff = Number(brawler["released"]) - Number(data[answer]["released"]);
                square.classList.add(releasedDiff < 0 ? "up" : releasedDiff > 0 ? "down" : "green");
            } else {
                square.classList.add(correct_categories[index] ? "green" : "red");
            }
        }
    
        row.appendChild(square);
    });
    list.insertBefore(row, list.children[1]);

    if (!list.querySelector('.fadeIn')) { // Fade in the category labels if they are not there already
        document.getElementById('label-row').classList.add('fadeIn');
    }

    let lastSquare = row.lastElementChild;
    lastSquare.addEventListener('animationend', () => { // If the last animation plays of a guess...
        // Renable the input
        inputField.classList.remove('disabled');
        guessForm.classList.remove('disabled');
        // Check if all categories are correct
        if (correct_categories.every(Boolean)) {
            onWin(); // This means they won
        }
    });
}

function handleFormSubmit(brawlerName) {
    saveGuess(brawlerName.toLowerCase()); // RECORD GUESS

    inputField.classList.add('disabled'); // disable inputs
    inputField.blur(); // Remove focus from the input field
    guessForm.classList.add('disabled');

    const brawler = data[brawlerName.toLowerCase()];
    displayGuess(brawler, brawlerName);

    if (brawler) inputField.value = '';
}

function displayWin(brawlerName, numberOfTries) {
    const win_portrait = document.getElementById('win-portrait');
    const win_brawler_name = document.getElementById('win-brawler-name');
    const win_num_of_tries = document.getElementById('win-num-of-tries');

    win_portrait.style.backgroundImage = `url("assets/portraits/${answer}_portrait.png")`;
    win_brawler_name.textContent = answer.toUpperCase();
    win_num_of_tries.textContent = String(guessedBrawlers.length);
}

function onWin() {
    inputField.classList.add('disabled'); // disable inputs
    inputField.blur(); // Remove focus from the input field
    guessForm.classList.add('disabled');

    const win_info = document.getElementById('win-info');
    displayWin();

    if (!alreadyWon) {
        alreadyWon = true;
        localStorage.setItem('won', alreadyWon);
        triggerConfetti();
        setTimeout(() => {
            win_info.style.margin = '3em auto';
            win_info.classList.add('fadeIn');
            win_info.classList.remove('hidden');
            win_info.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, winScrollDelay); // Match the animation delay (1s)
    }
}

loadPreviousGame();