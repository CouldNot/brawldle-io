// Country or Brawler names array
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
  
  
const inputField = document.getElementById('field');
const guessForm = document.getElementById('guess');

// Create and append the suggestion list to the body (hidden by default)
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
    suggestionList.innerHTML = '';  // Clear previous suggestions
  
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
            pinImage.style.marginRight = '0.5em'; // Add spacing between image and text

            listItem.appendChild(pinImage);
            listItem.appendChild(document.createTextNode(suggestion));

            listItem.addEventListener('click', () => {
                inputField.value = suggestion;
                suggestionList.style.display = 'none';  // Hide the suggestion list
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
    } else if (e.key === 'Enter' && currentIndex >= 0) {
        inputField.value = items[currentIndex].textContent;
        suggestionList.style.display = 'none';  // Hide suggestion list
        currentIndex = -1;  // Reset the current index
    }
});

function updateHighlightedItem(items) {
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.style.backgroundColor = '#f0f0f0';  // Highlight the selected item
        } else {
            item.style.backgroundColor = '';  // Remove highlight from others
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
