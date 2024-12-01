import { getAlreadyWon, getAnswer, getStoredGuesses, getYesterdayAnswer, lowercaseToBrawlerName } from "./storage.js";
import { triggerConfetti } from "./confetti.js";
import { data } from "./data.js";

const flipDelay = 450;
const winScrollDelay = 1500;

let answer = getAnswer();
let alreadyWon = getAlreadyWon();
let guessedBrawlers = getStoredGuesses();

const inputField = document.getElementById('field');
const guessForm = document.getElementById('guess');

if(alreadyWon) { // don't let user guess again if they have already won
    inputField.classList.add('disabled');
}

export function updateYesterdayBrawler() {
    let yesterday_answer = getYesterdayAnswer();
    const yesterday_icon = document.getElementById('yesterday-icon');
    yesterday_icon.src=`assets/pins/${yesterday_answer.toLowerCase()}_pin.png`;

    const yesterday_name = document.getElementById('yesterday-name');
    yesterday_name.innerHTML= lowercaseToBrawlerName(yesterday_answer);
}

export function displayGuess(brawler, brawlerName) {
    inputField.classList.add('disabled'); // disable inputs
    inputField.blur(); // Remove focus from the input field
    guessForm.classList.add('disabled');

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

export function displayWin(brawlerName, numberOfTries) {
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
        }, winScrollDelay);
    }
}