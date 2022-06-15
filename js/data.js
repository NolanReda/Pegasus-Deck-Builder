/* exported data */

var data = {
  view: 'search',
  decks: {
    deck1: {
      cards: [],
      nextCardId: 0
    }
  },
  resultId: 1
};

var previousJsonEntry = localStorage.getItem('cardData');

if (previousJsonEntry !== null) {
  data = JSON.parse(previousJsonEntry);
}

function handleUnload(event) {
  var jsonEntry = JSON.stringify(data);
  localStorage.setItem('cardData', jsonEntry);
}

window.addEventListener('beforeunload', handleUnload);
