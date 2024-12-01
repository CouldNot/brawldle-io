/*
Manages localStorage operations.
*/

import { data } from "./data.js";

export function getStoredGuesses() {
    return JSON.parse(localStorage.getItem('guesses')) || [];
}

export function saveGuess(brawlerName) {
    const guesses = getStoredGuesses();
    guesses.push(brawlerName);
    
    localStorage.setItem('guesses', JSON.stringify(guesses));
}

export function getAnswer() {
    let answer = localStorage.getItem('answer') || randomBrawler();
    setAnswer(answer);
    return answer;
}

export function getYesterdayAnswer() {
    return "darryl"
}

export function setAnswer(answer) {
    localStorage.setItem('answer', answer);
}

export function getAlreadyWon() {
    return localStorage.getItem('won') || false;
}

export function getPuzzleNumber() {
    return '46';
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

function randomBrawler() {
    const brawlers = Object.keys(data);
    return brawlers[Math.floor(Math.random() * brawlers.length)];
}