import { getAlreadyWon, getAnswer, getHardMode, getPuzzleNumber, getStoredGuesses, getYesterdayAnswer, lowercaseToBrawlerName } from "./storage.js";
import { triggerConfetti } from "./confetti.js";
import { data } from "./data.js";
import { countdown } from "./clock.js";

const flipDelay = 450;
const winScrollDelay = 1500;

let answer = getAnswer();
let alreadyWon = getAlreadyWon();

const inputField = document.getElementById('field');
const guessForm = document.getElementById('guess');
const categories = ["brawler", "rarity", "class", "movement", "range", "reload", "released"];

if(alreadyWon) { // don't let user guess again if they have already won
    inputField.classList.add('disabled');
}

const website_notice_date = document.getElementById('website-notice-date')
website_notice_date.innerHTML = new Date().getFullYear().toString();

export function updateYesterdayBrawler() {
    let yesterday_answer = getYesterdayAnswer();
    const yesterday_icon = document.getElementById('yesterday-icon');
    const yesterday_number = document.getElementById('yesterday-number');

    yesterday_icon.src=`assets/pins/${yesterday_answer.toLowerCase()}_pin.png`;
    yesterday_number.innerHTML = `#${getPuzzleNumber()-1}`

    const yesterday_name = document.getElementById('yesterday-name');
    yesterday_name.innerHTML= lowercaseToBrawlerName(yesterday_answer);
}

export function displayGuess(brawler, brawlerName) {
    inputField.classList.add('disabled'); // disable inputs
    inputField.blur(); // Remove focus from the input field
    guessForm.classList.add('disabled');

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
                if (!(getHardMode())) {
                    const releasedDiff = Number(brawler["released"]) - Number(data[answer]["released"]);
                    square.classList.add(releasedDiff < 0 ? "up" : releasedDiff > 0 ? "down" : "green");
                } else {
                    square.classList.add(correct_categories[index] ? "green" : "red");
                }
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
    win_num_of_tries.textContent = String(getStoredGuesses().length);

    let share_button = document.getElementById('win-share-button');
    share_button.onclick = onShareButtonClicked;

    countdown();
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

function onShareButtonClicked() {
    const text = guessesToEmojis(getStoredGuesses(), answer);

    // // Copy the text to the clipboard
    navigator.clipboard.writeText(text);

    // Change text to "copied"
    let share_button_text = document.getElementById('win-share-button-text');
    let share_button_icon = document.getElementById('win-share-button-icon')

    share_button_icon.style.display = 'none';
    share_button_text.innerHTML = "Copied!";

    // After 2 seconds
    setTimeout(function() {
        share_button_icon.style.display = 'block';
        share_button_text.innerHTML = "Share";
    }, 1500);

}

function guessesToEmojis(guesses, answer) {
    var emojis=''
    for (var i in guesses) {
        let guess = guesses[i];
        var correct = categories.map(category => data[guess][category] === data[answer][category]);
        correct = correct.splice(1);
        for (var j in correct) {
            if (j < 5) {
                if (correct[j]) emojis += '🟩';
                else emojis += '🟥';
            } else {
                if (Number(data[guess]['released']) > Number(data[answer]['released'])) {
                    emojis += '⬇️'
                } else if (Number(data[guess]['released']) < Number(data[answer]['released'])) {
                    emojis += '⬆️'
                } else {
                    emojis += '🟩'
                }
            }
        }
        emojis += ' \n';
    }
    emojis += `I solved Brawldle #${getPuzzleNumber()} in ${guesses.length} guesses! 🎮\n`;
    // reverse the emojis string
    return emojis.trim().split('\n').reverse().join('\n');
}

