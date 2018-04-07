//array for cards' symbols
let cards = [
  'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt',
  'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle',
  'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb',
  'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'
];

//array to handle opened cards
let openedCards;

//array to handle current 2 cards to be checked
let currCards;

//counter for correct guesses
let matchedCounter;

//counter for movement
let moveCounter;
let moves;

let rank;
let goodRank, fairRank;
//counter for solid stars
let starCounter;

let seconds, minutes;
let timerId;

let complete;
let result;

startGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// startGame function which initiate the game
function startGame () {
  cards = shuffle(cards);

  let deck = document.getElementsByClassName('deck').item(0);
  deck.innerHTML = '';

  openedCards = [];
  currCards = [];

  matchedCounter = 0;

  moveCounter = 0;
  moves = document.getElementsByTagName('span').item(0);
  moves.innerHTML = moveCounter;

  rank = document.getElementsByClassName('stars').item(0);
  goodRank =  rank.children[2].firstElementChild;
  fairRank =  rank.children[1].firstElementChild;
  goodRank.className = 'fa fa-star';
  fairRank.className = 'fa fa-star';

  let restart = document.getElementsByClassName('restart').item(0);
  restart.addEventListener('click', function() {
    startGame();
  });

  seconds = 0;
  minutes = 0;

  //set timer every second
  timerId = setInterval(tick, 1000);

  complete = document.getElementById('complete');
  let replay = document.getElementById('replay');
  replay.addEventListener('click', function() {
    complete.style.display = 'none';
    startGame();
  });

  //create cards and add it to game board
  for (let card of cards) {
    let newCard = document.createElement('li');
    newCard.className = 'card';

    newCard.addEventListener('click', function() {
      //disable clicking on more than 2 card at a time
      //disable clicking on matched cards
      //disable clicking on opened card twice
      if (currCards.length < 2 && newCard.className !== 'card match' && newCard.className !== 'card open show') {
        //open card then check match
        openCard(newCard);
        checkCard(newCard);
      }
    });

    let newSymbol = document.createElement('i');
    newSymbol.className = card;

    newCard.appendChild(newSymbol);
    deck.appendChild(newCard);
  }
}

// tick function which set time
function tick() {
  let timer = document.getElementsByClassName('timer').item(0);

  if (seconds == 59) {
    seconds = 0;
    minutes++;
  }
  else {
    seconds++;
  }

  timer.innerHTML = `${minutes} minutes : ${seconds} seconds`;
}

// openCard function which open clicked card
function openCard(card) {
  card.className = 'card open show';
}

// checkCard function which check match between 2 cards
function checkCard(card) {
  addMovement();

  currCards.push(card);

  let symbol = card.firstElementChild.className;
  openedCards.push(symbol);

  //check if a matched card is already opened
  if (openedCards.filter(openCard => openCard == symbol).length > 1) {
    lockCard();
  }
  //check if 2 cards are opened but not matched
  else if (openedCards.filter(openCard => openCard == symbol).length == 1 && currCards.length == 2) {
    for (let card of currCards) {
      card.className = 'card shake';
    }

    //hide unmatched cards after 0.5 second
    setTimeout(hideCard, 500);
  }
}

// addMovement function which maintain movement counter and stars rank
function addMovement() {
  moves.innerHTML = ++ moveCounter;

  if (moveCounter > 16 && moveCounter <= 32) {
    goodRank.className = 'fa fa-star-o';
  }
  else if (moveCounter > 32) {
    fairRank.className = 'fa fa-star-o';
  }
}

// lockCard function which lock 2 cards with correct guess
function lockCard () {
  matchedCounter++;

  for (let card of currCards) {
    card.className = 'card match';
  }

  currCards.pop();
  currCards.pop();

  if (matchedCounter == 8) {
    clearInterval(timerId);
    result = document.getElementsByClassName('result').item(0);
    starCounter = document.getElementsByClassName('fa fa-star').length;
    result.innerHTML = `In ${minutes} minutes : ${seconds} seconds, with ${moveCounter} Moves and ${starCounter} Stars.`;
    complete.style.display = 'block';
  }
}

// hideCard function which hide 2 cards with incorrect guess
function hideCard() {
  for (let card of currCards) {
    card.className = 'card';
  }

  currCards.pop();
  currCards.pop();
  openedCards.pop();
  openedCards.pop();
}
