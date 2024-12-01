import { loadPreviousGame } from './game_logic.js';
import { getAnswer } from './storage.js';
import { updateYesterdayBrawler } from './ui.js';
import { updateSuggestions } from './input_handler.js';

const yesterday_answer = 'brock'

const answer = getAnswer();

console.log(answer)

updateYesterdayBrawler();
updateSuggestions();
loadPreviousGame();