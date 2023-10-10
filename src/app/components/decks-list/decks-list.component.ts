import { Component, OnInit } from '@angular/core';
import { Deck } from 'src/app/model/Deck';
import { DeckService } from 'src/app/services/deck.service';


@Component({
  selector: 'app-decks-list',
  templateUrl: './decks-list.component.html',
  styleUrls: ['./decks-list.component.scss']
})
export class DecksListComponent implements OnInit {
  decks: Deck[] = [];

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.decks = this.deckService.getDecks();

  }

  onDeleteDeck(id: string): void {
    this.deckService.deleteDeck(id);
    this.decks = this.deckService.getDecks();
  }
}
