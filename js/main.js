var $searchBar = document.querySelector('#search-bar');
var $searchButton = document.querySelector('#search-button');
var $resultList = document.querySelector('#search-results');

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
