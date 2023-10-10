import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { Deck } from 'src/app/model/Deck';
import { Card } from 'src/app/model/Card';
import { DeckService } from 'src/app/services/deck.service';

@Component({
  selector: 'app-deck-form',
  templateUrl: './deck-form.component.html',
  styleUrls: ['./deck-form.component.scss']
})
export class DeckFormComponent implements OnInit {
  deckForm: FormGroup;
  deck: Deck = {
    name: '',
    id: '',
    cards: []
  };

  selectedCard: Card;
  decks: Deck[] = [];
  selectedDeck: string;
  cards: Card[] = [];


  constructor(
    public dialogRef: MatDialogRef<DeckFormComponent>,
    private deckService: DeckService) {}

  ngOnInit(): void {
    this.deck = {...this.deck, ...this.deckService.getDeckFromLocalStorage()};
    if (!this.deck.cards) {
      this.deck.cards = [];
    }
    this.deck.id = Math.random().toString(36).substring(2, 11);
    this.deck.cards = [];
    this.loadDecks();

    this.deck = {
      name: '',
      id: '',
      cards: []
    };

    this.deck[0] = null;
    delete this.deck[0];
  }

  onSubmit(): void {
    if (!this.deck.name || this.deck.name.trim() === '') {
      Swal.fire({
        title: 'Erro!',
        text: 'O nome do baralho é obrigatório!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.deck.id) {
      this.deckService.updateDeck(this.deck);
      console.log('Baralho atualizado com sucesso!', this.deck);

      Swal.fire({
        title: 'Sucesso!',
        text: 'Baralho atualizado com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      this.deck.id = Math.random().toString(36).substring(2, 11);
      this.deckService.addDeck(this.deck);
      console.log('Baralho criado com sucesso!', this.deck);

      Swal.fire({
        title: 'Sucesso!',
        text: 'Baralho criado com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }

    console.log('Baralhos no LocalStore:', this.deckService.getDecks());
    this.onClose();
}


  selectCard(card: Card): void {
    this.selectedCard = card;
    console.log('Carta selecionada:', this.selectedCard);
  }


  loadDecks(): void {
    const storedDecks = JSON.parse(localStorage.getItem('decks'));
    if (storedDecks) {
      this.decks = storedDecks;
    }
  }

  EditDecks(): void {
    window.location.href = '/edit-deck';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
