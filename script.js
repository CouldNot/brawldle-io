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

const data = {
    shelly: {
        rarity: "Starting Brawler",
        class: "Damage Dealer",
        movement: "Fast",
        range: "Long",
        reload: "Normal",
        released: "2017"
    },
    colt: {
        rarity: "Rare",
        class: "Damage Dealer",
        movement: "Normal",
        range: "Long",
        reload: "Fast",
        released: "2017"
    },
    bull: {
        rarity: "Rare",
        class: "Tank",
        movement: "Fast",
        range: "Normal",
        reload: "Normal",
        released: "2017"
    },
    brock: {
        rarity: "Rare",
        class: "Marksman",
        movement: "Normal",
        range: "Long",
        reload: "Slow",
        released: "2017"
    }
};
  
const answer = 'colt'
  
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
        if (currentIndex >= 0) {
            inputField.value = items[currentIndex].textContent;
        } else if (items.length === 1) {
            inputField.value = items[0].textContent;
        }
        suggestionList.style.display = 'none'; // Hide suggestion list
        handleFormSubmit(inputField.value); // Trigger form submission logic
        currentIndex = -1; // Reset the current index
        e.preventDefault(); // Prevent form submission
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

guessForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputValue = inputField.value.trim();
    if (inputValue && inputValue.toLowerCase() in data) {
        handleFormSubmit(inputValue);
    }
});

function handleFormSubmit(brawlerName) {
    console.log(`Submitted Brawler: ${brawlerName}`);
    let guess = inputField.value.trim().toLowerCase();
    let brawler = data[brawlerName.toLowerCase()];

    let brawler_column = document.getElementById("brawler_column");
    let rarity_column = document.getElementById("rarity_column");
    let bclass_column = document.getElementById("class_column");
    let movement_column = document.getElementById("movement_column");
    let range_column = document.getElementById("range_column");
    let reload_column = document.getElementById("reload_column");
    let released_column = document.getElementById("released_column");

    const separator = document.createElement("div");
    separator.classList.add("seperator");
    if (document.querySelectorAll("#grid .seperator").length == 0) {
        brawler_column.innerHTML = 'Brawler<div class="seperator"></div>';
        rarity_column.innerHTML = 'Rarity<div class="seperator"></div>';
        bclass_column.innerHTML = 'Class<div class="seperator"></div>';
        movement_column.innerHTML = 'Movement<div class="seperator"></div>';
        range_column.innerHTML = 'Range<div class="seperator"></div>';
        reload_column.innerHTML = 'Reload<div class="seperator"></div>';
        released_column.innerHTML = 'Released<div class="seperator"></div>';
    }

    const portrait = document.createElement('div');
    portrait.classList.add('square');
    portrait.classList.add('portrait');
    portrait.style.backgroundImage = `url("assets/portraits/${brawlerName.toLowerCase()}_portrait.png")`;

    const rarity = document.createElement('div');
    rarity.classList.add('square');
    rarity.innerHTML = String(data[guess].rarity);
    if (data[guess].rarity == data[answer].rarity) {
        rarity.classList.add('green')
    } else {
        rarity.classList.add('red')
    }

    const bclass = document.createElement('div');
    bclass.classList.add('square');
    bclass.innerHTML = String(data[guess].class);
    if (data[guess].class == data[answer].class) {
        bclass.classList.add('green')
    } else {
        bclass.classList.add('red')
    }

    const movement = document.createElement('div');
    movement.classList.add('square');
    movement.innerHTML = String(data[guess].movement);
    if (data[guess].movement == data[answer].movement) {
        movement.classList.add('green')
    } else {
        movement.classList.add('red')
    }

    const range = document.createElement('div');
    range.classList.add('square');
    range.innerHTML = String(data[guess].range);
    if (data[guess].range == data[answer].range) {
        range.classList.add('green')
    } else {
        range.classList.add('red')
    }

    const reload = document.createElement('div');
    reload.classList.add('square');
    reload.innerHTML = String(data[guess].reload);
    if (data[guess].reload == data[answer].reload) {
        reload.classList.add('green')
    } else {
        reload.classList.add('red')
    }

    const released = document.createElement('div');
    released.classList.add('square');
    released.innerHTML = String(data[guess].released);
    if (data[guess].released == data[answer].released) {
        released.classList.add('green')
    } else if (data[guess].released > data[answer].released) {
        released.classList.add('down')
    } else {
        released.classList.add('up')
    }

    brawler_column.insertBefore(portrait, brawler_column.children[1]);
    rarity_column.insertBefore(rarity, rarity_column.children[1]);
    bclass_column.insertBefore(bclass, bclass_column.children[1]);
    movement_column.insertBefore(movement, movement_column.children[1]);
    range_column.insertBefore(range, range_column.children[1]);
    reload_column.insertBefore(reload, reload_column.children[1]);
    released_column.insertBefore(released, released_column.children[1]);
}