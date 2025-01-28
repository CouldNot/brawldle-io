import { loadPreviousGame } from './game_logic.js';
import { checkDailyReset, getAnswer } from './storage.js';
import { startUpdatingWins, updateStats, updateYesterdayBrawler } from './ui.js';
import { updateSettings, updateSuggestions } from './input_handler.js';

checkDailyReset();
updateYesterdayBrawler();
updateSuggestions();
updateSettings();
updateStats();
loadPreviousGame();
startUpdatingWins();
