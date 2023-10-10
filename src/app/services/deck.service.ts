import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Deck } from '../model/Deck';
import { catchError } from 'rxjs/operators';
import { Card } from '../model/Card';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private decks: Deck[] = [];
  private readonly localStorageKey = 'decks';
  private decksSubject = new BehaviorSubject<Deck[]>(this.getDeckFromLocalStorage());
  decks$ = this.decksSubject.asObservable();


  private apiUrl = 'https://api.pokemontcg.io/v2/cards';

  constructor(private http: HttpClient) {}

  getDecks(): Deck[] {
    const decks = localStorage.getItem(this.localStorageKey);
    return decks ? JSON.parse(decks) : [];
  }


  getDeck(id: string): Deck | null {
    const decks = this.getDecks();
    return decks.find(deck => deck.id === id) || null;
  }

  addDeck(deck: Deck): void {
    const decks = this.getDecks();

    const sameNameCount = decks.filter(existingDeck => existingDeck.name === deck.name).length;
    if (sameNameCount >= 60) {
      console.error('Não é possível criar mais de 60 baralhos com o mesmo nome.');
      return;
    }

    decks.push(deck);
    localStorage.setItem(this.localStorageKey, JSON.stringify(decks));
  }

  updateDeck(updatedDeck: Deck): Observable<Deck> {
    let decks = this.getDecks();

    if (decks.some(deck => deck.name === updatedDeck.name && deck.id !== updatedDeck.id)) {
      return of(null);
    }

    decks = decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck);
    localStorage.setItem(this.localStorageKey, JSON.stringify(decks));

    return of(updatedDeck);
  }

  deleteDeck(id: string): void {
    if (!id) {
        console.error('Erro: O ID do baralho não pode ser nulo ou indefinido.');
        return;
    }

    const currentDecks = this.decksSubject.getValue();

    if (!currentDecks || currentDecks.length === 0) {
        console.error('Erro: Não há baralhos para deletar.');
        return;
    }

    const updatedDecks = currentDecks.filter(deck => deck.id !== id);

    if (updatedDecks.length === currentDecks.length) {
        console.error(`Erro: Não foi possível encontrar um baralho com o ID ${id} para deletar.`);
        return;
    }

    this.decksSubject.next(updatedDecks);
    this.updateLocalStorage(updatedDecks);

    console.log(`Baralho com ID ${id} deletado com sucesso.`);
}

private updateLocalStorage(decks: Deck[]): void {
    if (!decks) {
        console.error('Erro: A lista de baralhos não pode ser nula ou indefinida ao atualizar o armazenamento local.');
        return;
    }

    try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(decks));
        console.log('Baralhos atualizados com sucesso no armazenamento local.');
    } catch (error) {
        console.error('Erro ao atualizar baralhos no armazenamento local:', error);
    }
}

  fetchCards(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  public getDeckFromLocalStorage(): Deck[] {
    const storedDecks = localStorage.getItem('decks');
    return storedDecks ? JSON.parse(storedDecks) : [];
  }

getLastDeck(): Deck {
  const decks = this.getDecks();
  return decks[decks.length - 1];
}

  getCardByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar o card:', error);
        return of(null);
      })
    );
  }

  getCardById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao buscar o card:', error);
        return of(null);
      })
    );
  }

  getPaginatedDecks(pageIndex: number, pageSize: number): Deck[] {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return this.decks.slice(start, end);
  }
}


