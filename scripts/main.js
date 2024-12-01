import { loadPreviousGame } from './game_logic.js';
import { checkDailyReset, getAnswer } from './storage.js';
import { updateStats, updateYesterdayBrawler } from './ui.js';
import { updateSettings, updateSuggestions } from './input_handler.js';

const answer = getAnswer();

// REMEMBER TO GET RID OF THIS
console.log(answer)

checkDailyReset();
updateYesterdayBrawler();
updateSuggestions();
updateSettings();
updateStats();
loadPreviousGame();