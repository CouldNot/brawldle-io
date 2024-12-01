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
    // test to see if over the 86 day time span there are repeats
    return getDailyBrawler();
}

function getDailyBrawler(offset = 0) {
    const MS_IN_A_DAY = 86400000;
    const todaySeed = Math.floor(new Date().getTime() / MS_IN_A_DAY) + offset;

    // Use a fixed shuffle seed based on the start date
    const cycleSeed = Math.floor(new Date(startDate).getTime() / MS_IN_A_DAY);
    const brawlersShuffled = shuffleArrayWithSeed(brawlers, cycleSeed);

    // Use todaySeed to pick the index deterministically
    const index = todaySeed % brawlers.length; // Cycle through without reshuffling
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

function daysSinceStart(startDate) {
    const today = new Date();
    const diffInTime = today - new Date(startDate); // Time difference in milliseconds
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

function mulberry32(seed) {
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}