import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MagicService {

  shuffleCards(cards) {
    for (let i = cards.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [cards[i - 1], cards[j]] = [cards[j], cards[i - 1]];
    }
  }

  drawCard(deck: Object[]) {
    if (deck.length > 0) {
      return deck.pop();
    }
  }

  dealCards(cards: Object[], deck: Object[]) {
    for (let i = 1; i <= 7; i++) {
      cards.push(deck.pop());
    }
  }

  determineTurn(card, isOpponentsPlay) {
    if (isOpponentsPlay) {
      if (card.value == 'Skip') {
        return true;
      } else {
        return false;
      }
    } else {
      if (card.value == 'Skip') {
        return false;
      } else {
        return true;
      }
    }
  }

  prepareAnnouncement(isOpponentsTurn, opponentsHand, playersHand) {
    if (opponentsHand.length == 0) {
      return {text: 'THE OPPONENT HAS WON THE MATCH!', matchWon: true};
    } else if (playersHand.length == 0) {
      return {text: 'YOU HAVE WON THE MATCH!', matchWon: true};
    } else {
      if (isOpponentsTurn) {
        return {text: 'OPPONENT\'S TURN', matchWon: false};
      } else {
        return {text: 'YOUR TURN', matchWon: false};
      }
    }
  }

  buildDeck(cards: Object[]) {

    let color: string;

    cards.push({ color: 'Red',    value: 0, file: 'Red_0.png' });
    cards.push({ color: 'Yellow', value: 0, file: 'Yellow_0.png' });
    cards.push({ color: 'Green',  value: 0, file: 'Green_0.png' });
    cards.push({ color: 'Blue',   value: 0, file: 'Blue_0.png' });

  for (let i = 1; i <= 96; i++) {

    if (i <= 24)      { color = 'Red';    }
    else if (i <= 48) { color = 'Yellow'; }
    else if (i <= 72) { color = 'Green';  }
    else if (i <= 96) { color = 'Blue';   }

    //Assign value based on modulus.
    if (i % 12 == 10) {
      cards.push({ color: color, value: 'Skip',     file: color + '_Skip.png' });
    } else if (i % 12 == 11) {

    } else if (i % 12 == 0) {

    } else {
      cards.push({ color: color, value: i % 12,     file: color + '_' + (i % 12) + '.png' });
    }

  }

}

sortByKey(array, key) {

  if (key == 'color') {
    return array.sort(function(a, b) {
      var x = a.color;
      var y = b.color;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  else if (key == 'value') {

    for (let i = 0; i < array.length; i++) {
      if (array[i].value == 'Skip') {
        array[i].value = 10;
      }
    }

    array = array.sort(function(a, b) {
      var x = a.value;
      var y = b.value;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    for (let i = 0; i < array.length; i++) {
      if (array[i].value == 10) {
        array[i].value = 'Skip';
      }
    }

    return array;

  }
}

}
