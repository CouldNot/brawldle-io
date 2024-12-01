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

export function lowercaseToBrawlerName(brawlerName) {
    let formattedName = brawlerName
        .split(/[\s-]/) // Split on spaces or dashes
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); // Join with spaces or customize to rejoin with dashes if needed
    return formattedName;
}

function randomBrawler() {
    const brawlers = Object.keys(data);
    return brawlers[Math.floor(Math.random() * brawlers.length)];
}