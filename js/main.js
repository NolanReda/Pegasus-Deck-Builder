var $searchBar = document.querySelector('#search-bar');
var $searchButton = document.querySelector('#search-button');
var $resultList = document.querySelector('#search-results');
var $searchForm = document.querySelector('.search-form');

var $response = {};

function searchResults(event) {
  event.preventDefault();
  $resultList.replaceChildren('');
  data.resultId = 1;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + $searchBar.value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    $response = xhr.response;
    if (xhr.status === 400) {
      if ($searchResults.childElementCount === 1) {
        var $noResult = document.querySelector('#no-result');
        $searchResults.removeChild($noResult);
      }
      var noResult = document.createElement('div');
      noResult.setAttribute('class', 'row none');
      noResult.setAttribute('id', 'no-result');
      var h1 = document.createElement('h1');
      h1.setAttribute('class', 'no-result-found');
      var nothing = document.createTextNode('No Results Found');
      h1.appendChild(nothing);
      noResult.appendChild(h1);
      $resultList.appendChild(noResult);
    }
    if (!$searchBar.value) {
      if ($searchResults.childElementCount === 1) {
        var $nothing = document.querySelector('#none');
        $searchResults.removeChild($nothing);
      }
      var noSearch = document.createElement('div');
      noSearch.setAttribute('class', 'row none');
      noSearch.setAttribute('id', 'none');
      var h1i = document.createElement('h1');
      h1i.setAttribute('class', 'no-result-found');
      var nothing1 = document.createTextNode('Please search a valid card');
      h1i.appendChild(nothing1);
      noSearch.appendChild(h1i);
      $resultList.appendChild(noSearch);
      return;
    }
    if (xhr.status === 200) {
      if ($searchResults.childElementCount > 1) {
        var $cards = document.querySelectorAll('.card-wrapper');
        $searchResults.removeChild($cards);
      }
      for (let i = 0; i < this.response.data[0].card_images.length; i++) {
        var div = document.createElement('div');
        div.setAttribute('class', 'column-fourth card-wrapper');
        div.setAttribute('data-result-id', data.resultId);
        data.resultId++;
        var img = document.createElement('img');
        img.setAttribute('class', 'card');
        img.setAttribute('src', this.response.data[0].card_images[i].image_url);
        img.setAttribute('alt', this.response.data[0].name);
        div.appendChild(img);
        var add = document.createElement('button');
        add.setAttribute('id', 'add-button');
        add.setAttribute('class', 'add-button');
        add.innerHTML = 'Add card to deck';
        div.appendChild(add);
        var select = document.createElement('select');
        select.setAttribute('id', 'deck-select');
        select.setAttribute('class', 'deck-select');
        var selectOne = document.createElement('option');
        var blankOption = document.createTextNode('select');
        selectOne.appendChild(blankOption);
        select.appendChild(selectOne);
        for (var deck in data.decks) {
          var option = document.createElement('option');
          option.setAttribute('value', deck);
          var optionText = document.createTextNode(deck);
          option.appendChild(optionText);
          select.appendChild(option);
        }
        div.appendChild(select);
        $resultList.appendChild(div);
      }
    }
  });
  xhr.send();
}

$searchForm.addEventListener('submit', searchResults);
$searchButton.addEventListener('click', searchResults);
$searchForm.addEventListener('submit', searchResults);

var $dataView = document.querySelectorAll('[data-view]');
var $returnButton = document.querySelector('#return-button');

function viewSwap(viewName) {
  for (let i = 0; i < $dataView.length; i++) {
    if ($dataView[i].getAttribute('data-view') === viewName) {
      $dataView[i].className = 'view';
    } else if ($dataView[i].getAttribute('data-view') !== viewName) {
      $dataView[i].className = 'hidden';
    }
  }
}

var $navDecks = document.querySelector('#nav-decks');
var $navSearch = document.querySelector('#nav-card-search');
function navDecks(event) {
  viewSwap('decks');
}
$navDecks.addEventListener('click', navDecks);

function navSearch(event) {
  $searchBar.value = '';
  currentDeck = null;
  viewSwap('search');
}
$navSearch.addEventListener('click', navSearch);

function handleReturn(event) {
  if (currentDeck === null) {
    viewSwap('search');
  } else {
    viewSwap('deck-display');
  }
}
$returnButton.addEventListener('click', handleReturn);

var $searchResults = document.querySelector('#search-results');

var $deckDisplay = document.querySelector('#deck-display');

var $detailImg = document.querySelector('.detail-img');
var $cardName = document.querySelector('#card-name');
var $cardType = document.querySelector('#card-type');
var $cardDesc = document.querySelector('#card-desc');
var $amazon = document.querySelector('#amazon');
var $cardMarket = document.querySelector('#card-market');
var $coolStuff = document.querySelector('#coolstuff');
var $ebay = document.querySelector('#ebay');
var $tcgPlayer = document.querySelector('#tcgplayer');

function getDetails(event) {
  if (event.target.closest('div[data-view]').attributes[1].value === 'search') {
    if (event.target.className === 'card') {
      $detailImg.setAttribute('src', $searchResults.childNodes[event.target.closest('div').getAttribute('data-result-id')].childNodes[0].src);
      $cardName.textContent = $response.data[0].name;
      $cardType.textContent = $response.data[0].race + '/' + $response.data[0].type;
      $cardDesc.textContent = $response.data[0].desc;
      $amazon.textContent = 'Amazon price: $' + $response.data[0].card_prices[0].amazon_price;
      $cardMarket.textContent = 'Cardmarket price: $' + $response.data[0].card_prices[0].cardmarket_price;
      $coolStuff.textContent = 'CoolStuff Inc price: $' + $response.data[0].card_prices[0].coolstuffinc_price;
      $ebay.textContent = 'Ebay price: $' + $response.data[0].card_prices[0].ebay_price;
      $tcgPlayer.textContent = 'TCGplayer price: $' + $response.data[0].card_prices[0].tcgplayer_price;
      viewSwap('details');
    }
  } else if (event.target.closest('div[data-view]').attributes[1].value === 'deck-display') {
    if (event.target.className === 'card') {
      $detailImg.setAttribute('src', event.target.src);
      for (let i = 0; i < currentDeck.cards.length; i++) {
        if (currentDeck.cards[i].cardId.toString() === event.target.closest('div[data-card-id]').attributes[1].value) {
          $cardName.textContent = currentDeck.cards[i].data[0].name;
          $cardType.textContent = currentDeck.cards[i].data[0].race + currentDeck.cards[i].data[0].type;
          $cardDesc.textContent = currentDeck.cards[i].data[0].desc;
          $amazon.textContent = 'Amazon price: $' + currentDeck.cards[i].data[0].card_prices[0].amazon_price;
          $cardMarket.textContent = 'Cardmarket price: $' + currentDeck.cards[i].data[0].card_prices[0].cardmarket_price;
          $coolStuff.textContent = 'CoolStuff Inc price: $' + currentDeck.cards[i].data[0].card_prices[0].coolstuffinc_price;
          $ebay.textContent = 'Ebay price: $' + currentDeck.cards[i].data[0].card_prices[0].ebay_price;
          $tcgPlayer.textContent = 'TCGplayer price: $' + currentDeck.cards[i].data[0].card_prices[0].tcgplayer_price;
          viewSwap('details');
        }
      }
    }
  }
}

$searchResults.addEventListener('click', getDetails);
$deckDisplay.addEventListener('click', getDetails);

function addCard(event) {
  if (event.target.getAttribute('id') === 'add-button') {
    for (var deck in data.decks) {
      if (deck === event.target.nextElementSibling.value) {
        var nextCard = {};
        nextCard.data = $response.data;
        nextCard.cardId = data.decks[deck].nextCardId;
        nextCard.imageUrl = $searchResults.childNodes[event.target.closest('div').getAttribute('data-result-id')].childNodes[0].src;
        data.decks[deck].cards.push(nextCard);
        data.decks[deck].nextCardId++;
      }
    }
  }
}

$searchResults.addEventListener('click', addCard);

var $modal = document.querySelector('#modal');
var $ok = document.querySelector('.ok');
// var $select = document.querySelector('#deck-delect');

function open(event) {
  if (event.target.parentElement.children[2].value === 'select') {
    return;
  }
  if (event.target.getAttribute('id') === 'add-button') {

    $modal.showModal();
  }
}

$searchResults.addEventListener('click', open);
function close(event) {
  $modal.close();
}
$ok.addEventListener('click', close);

var $deckName = document.querySelector('#deck-name');
var $newDeck = document.querySelector('#new-deck');
var $deckInput = document.querySelector('.new-deck-input');

function newDeckView(event) {
  if ($deckInput.childElementCount === 4) {
    $deckInput.removeChild($deckInput.lastChild);
  }
  $deckName.value = '';
  viewSwap('new-deck');
}
$newDeck.addEventListener('click', newDeckView);

var $createDeck = document.querySelector('#create-deck');

function createNewDeck(event) {
  if ($deckName.value === '') {
    return;
  }
  data.decks[$deckName.value] = {
    cards: [],
    nextCardId: 0
  };
}

$createDeck.addEventListener('click', createNewDeck);

var $deckRows = document.querySelector('#deck-rows');

function loadDecks(event) {
  if (event.type === 'click' && $deckName.value === '') {
    if ($deckInput.childElementCount === 4) {
      var $no = document.querySelector('#no-deck');
      $deckInput.removeChild($no);
    }
    var fail = document.createElement('div');
    fail.setAttribute('class', 'row none');
    fail.setAttribute('id', 'no-deck');
    var noDeck = document.createElement('h4');
    noDeck.setAttribute('class', 'no-result-found');

    var nothing = document.createTextNode('Please enter a deck name');
    noDeck.appendChild(nothing);
    fail.appendChild(noDeck);
    $deckInput.appendChild(fail);
    return;
  }
  if (event.type === 'DOMContentLoaded') {
    for (var deck in data.decks) {
      var div = document.createElement('div');
      div.setAttribute('class', 'column-fourth card-wrapper');
      var cardName = document.createElement('p');
      cardName.setAttribute('class', 'card-name');
      var nameText = document.createTextNode(deck);
      cardName.appendChild(nameText);
      div.appendChild(cardName);
      var img = document.createElement('img');
      img.setAttribute('class', 'deck');
      img.setAttribute('src', 'images/card-back.png');
      img.setAttribute('alt', deck);
      div.appendChild(img);
      $deckRows.appendChild(div);
    }
  } else if (event.type === 'click') {
    var divClick = document.createElement('div');
    divClick.setAttribute('class', 'column-fourth card-wrapper');
    var cardNameClick = document.createElement('p');
    cardNameClick.setAttribute('class', 'card-name');
    var nameTextClick = document.createTextNode($deckName.value);
    cardNameClick.appendChild(nameTextClick);
    divClick.appendChild(cardNameClick);
    var imgClick = document.createElement('img');
    imgClick.setAttribute('class', 'deck');
    imgClick.setAttribute('src', 'images/card-back.png');
    imgClick.setAttribute('alt', $deckName.value);
    divClick.appendChild(imgClick);
    $deckRows.appendChild(divClick);
    viewSwap('decks');
    $deckName.value = '';
  }
}

window.addEventListener('DOMContentLoaded', loadDecks);
$createDeck.addEventListener('click', loadDecks);

var currentDeck = null;

var deckNameH1 = document.querySelector('#deck-name-h1');

function displayDeck(event) {
  $deckDisplay.replaceChildren('');
  deckNameH1.textContent = event.target.alt;
  if (event.target.getAttribute('class') === 'deck') {
    currentDeck = data.decks[event.target.previousElementSibling.innerHTML];
    for (let i = 0; i < currentDeck.cards.length; i++) {
      var div = document.createElement('div');
      div.setAttribute('class', 'column-fourth');
      div.setAttribute('data-card-id', currentDeck.cards[i].cardId);
      var img = document.createElement('img');
      img.setAttribute('class', 'card');
      img.setAttribute('src', currentDeck.cards[i].imageUrl);
      img.setAttribute('alt', currentDeck.cards[i].data[0].name);
      div.appendChild(img);
      var deleteButton = document.createElement('button');
      deleteButton.setAttribute('type', 'button');
      deleteButton.setAttribute('id', 'delete-button');
      deleteButton.setAttribute('class', 'delete-button');
      var deleteText = document.createTextNode('Delete');
      deleteButton.appendChild(deleteText);
      div.appendChild(deleteButton);
      $deckDisplay.appendChild(div);
    }
    viewSwap('deck-display');
  }
}

$deckRows.addEventListener('click', displayDeck);

var $returnToDecksButton = document.querySelector('#return-to-decks-button');
function returnToDecks(event) {
  viewSwap('decks');
}
$returnToDecksButton.addEventListener('click', returnToDecks);

var $deleteModal = document.querySelector('#delete-modal');
var eventTarget = null;

function openDelete(event) {
  eventTarget = event.target;
  if (event.target.className === 'delete-button') {
    $deleteModal.showModal();
  }
}
var $no = document.querySelector('#no');
function closeDelete(event) {
  $deleteModal.close();
}

$deckDisplay.addEventListener('click', openDelete);
$no.addEventListener('click', closeDelete);

var $confirm = document.querySelector('#confirm');

function handleDelete(event) {
  for (let i = 0; i < currentDeck.cards.length; i++) {
    if (currentDeck.cards[i].cardId.toString() === eventTarget.closest('div').attributes[1].value) {
      currentDeck.cards.splice(currentDeck.cards[i], 1);
      eventTarget.closest('div').remove();
    }
  }
}

$confirm.addEventListener('click', handleDelete);
$confirm.addEventListener('click', closeDelete);
