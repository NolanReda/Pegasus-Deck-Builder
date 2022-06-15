var $searchBar = document.querySelector('#search-bar');
var $searchButton = document.querySelector('#search-button');
var $resultList = document.querySelector('#search-results');

var $response = {};

function searchResults(event) {
  $resultList.replaceChildren('');
  data.resultId = 1;
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' + $searchBar.value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.status);
    // console.log(xhr.response);
    $response = xhr.response;
    if (xhr.status === 200) {
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
        $resultList.appendChild(div);
      }
    } else if (xhr.status === 400) {
      var noResult = document.createElement('div');
      noResult.setAttribute('class', 'row none');
      var h1 = document.createElement('h1');
      h1.setAttribute('class', 'no-result-found');
      var nothing = document.createTextNode('No Results Found');
      h1.appendChild(nothing);
      noResult.appendChild(h1);
      $resultList.appendChild(noResult);
    }
  });
  xhr.send();
}

$searchButton.addEventListener('click', searchResults);

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

function handleReturn(event) {
  viewSwap('search');
}
$returnButton.addEventListener('click', handleReturn);

var $searchResults = document.querySelector('#search-results');

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
}

$searchResults.addEventListener('click', getDetails);

function addCard(event) {
  if (event.target.getAttribute('id') === 'add-button') {
    // console.log(event.target);
    data.decks.deck1.cards.push($response);
    data.decks.deck1.cards[data.decks.deck1.nextCardId].imageUrl = $searchResults.childNodes[event.target.closest('div').getAttribute('data-result-id')].childNodes[0].src;
    data.decks.deck1.cards[data.decks.deck1.nextCardId].cardId = data.decks.deck1.nextCardId;
    data.decks.deck1.nextCardId++;
    // console.log('cards:', data.decks.deck1);
  }
}

$searchResults.addEventListener('click', addCard);
