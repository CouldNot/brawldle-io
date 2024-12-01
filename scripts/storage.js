/*
Manages localStorage operations and setting storage values.
*/

import { brawlers } from "./data.js";

const startDate = new Date('2024-11-29');
const currentDate = new Date();

export function getHardMode() {
    return JSON.parse(localStorage.getItem('hardmode')) || false;
}

export function setHardMode(mode) {
    localStorage.setItem('hardmode', mode);
}

export function getStoredGuesses() {
    return JSON.parse(localStorage.getItem('guesses')) || [];
}

export function saveGuess(brawlerName) {
    const guesses = getStoredGuesses();
    guesses.push(brawlerName);
    
    localStorage.setItem('guesses', JSON.stringify(guesses));
}

export function getAnswer() {
    return getDailyBrawler();
}

function getDailyBrawler(offset = 0) {
    var date = currentDate; // set date to today
    const MS_IN_A_DAY = 86400000;
    const todaySeed = Math.floor((date.getTime() + offset * MS_IN_A_DAY) / MS_IN_A_DAY);
    const brawlersShuffled = shuffleArrayWithSeed(brawlers, todaySeed); // Shuffle based on today's seed
    const index = todaySeed % brawlers.length; // Select the index deterministically
    return brawlersShuffled[index].toLowerCase();
}

export function getYesterdayAnswer() {
    return getDailyBrawler(-1);
}

export function setAnswer(answer) {
    localStorage.setItem('answer', answer);
}

export function getAlreadyWon() {
    return localStorage.getItem('won') === 'true';
}

export function getPuzzleNumber() {
    var date = startDate;
    return String(daysSinceStart(date));
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

function daysSinceStart(startDate) {
    var date = currentDate;
    const diffInTime = date - startDate; // Time difference in milliseconds
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)); // Convert to days
    return diffInDays;
}

function shuffleArrayWithSeed(array, seed) {
    const random = mulberry32(seed);
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// generator
function mulberry32(seed) {
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}