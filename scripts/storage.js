/*
Manages localStorage operations and setting storage values.
*/

import { brawlers } from "./data.js";

const startDate = '2024-11-29';

export function getStoredGuesses() {
    return JSON.parse(localStorage.getItem('guesses')) || [];
}

export function saveGuess(brawlerName) {
    const guesses = getStoredGuesses();
    guesses.push(brawlerName);
    
    localStorage.setItem('guesses', JSON.stringify(guesses));
}

export function getAnswer() {
    let answer = getDailyBrawler();
    setAnswer(answer);
    return answer;
}

function getDailyBrawler(offset = 0) {
    const MS_IN_A_DAY = 86400000;
    const todaySeed = Math.floor(new Date().getTime() / MS_IN_A_DAY);
    const seed = todaySeed + offset; // Offset: 0 for today, -1 for yesterday
    const random = mulberry32(seed); // random seed based on date
    const index = Math.floor(random() * brawlers.length);
    return brawlers[index].toLowerCase(); // Return as lowercase
}

export function getYesterdayAnswer() {
    return getDailyBrawler(-1);
}

export function setAnswer(answer) {
    localStorage.setItem('answer', answer);
}

export function getAlreadyWon() {
    return localStorage.getItem('won') || false;
}

export function getPuzzleNumber() {
    return String(daysSinceStart(startDate));
}

export function lowercaseToBrawlerName(brawlerName) {
    let formattedName = brawlerName
        .split(' ')  // Split by spaces first
        .map(word => {
            // Split by dash within the word, apply title case to each part, then join back with the dash
            return word.split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('-');
        })
        .join(' '); // Rejoin by spaces

    return formattedName;
}

// function randomBrawler() {
//     const brawlers = Object.keys(data);
//     return brawlers[Math.floor(Math.random() * brawlers.length)];
// }

function daysSinceStart(startDate) {
    const today = new Date();
    const diffInTime = today - new Date(startDate); // Time difference in milliseconds
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)); // Convert to days
    return diffInDays;
}

function mulberry32(seed) {
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}