import { loadPreviousGame } from './game_logic.js';
import { checkDailyReset, getAnswer } from './storage.js';
import { getWins, startUpdatingWins, updateStats, updateYesterdayBrawler } from './ui.js';
import { updateSettings, updateSuggestions } from './input_handler.js';
import { CountUp } from './countUp.js';

checkDailyReset();
updateYesterdayBrawler();
updateSuggestions();
updateSettings();
updateStats();
loadPreviousGame();
startUpdatingWins();

export function updateWinsAlreadyCounter(newWins) {
    let counter = document.getElementById("wins-already")
    let winsCount = Number(counter.innerHTML)
    if (newWins !== winsCount) {
        if (winsCount == 0) {
            var countUp = new CountUp('wins-already', newWins);
            countUp.start();
        } else {
            var countUp = new CountUp('wins-already', newWins, {
                startVal: winsCount
            });
            countUp.update(newWins,)
        }
    }
}