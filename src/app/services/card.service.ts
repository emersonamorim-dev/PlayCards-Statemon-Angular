import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Card } from '../model/Card';
import { Deck } from '../model/Deck';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = 'https://api.pokemontcg.io/v2/cards';
  private cache$: Observable<Card[]>;

  private decks: Deck[] = [];
  private readonly localStorageKey = 'decks';

  constructor(private http: HttpClient) { }

  public getCards(): Observable<Card[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<{data: Card[]}>(this.apiUrl).pipe(
        map(response => response.data.map(card => ({
          ...card,
          isFlipped: false
        }))),
        shareReplay(1),  // Cache the response
        catchError(error => {
          console.error('Erro ao buscar os cards:', error);
          return of([]);
        })
      );
    }

    return this.cache$;
  }

  addCardToDeck(deckId: string, cardId: string): void {
    const decks = this.getDecks();
    const deck = decks.find(d => d.id === deckId);

    if (deck) {
      deck.cards.push(cardId);
      this.updateDeck(deck);
    } else {
      console.error('Baralho não encontrado:', deckId);
    }
  }

  addDeck(deck: Deck): void {
    console.log('Adicionando baralho:', deck);

    const decks = this.getDecks();
    decks.push(deck);
    localStorage.setItem(this.localStorageKey, JSON.stringify(decks));
  }

  getDecks(): Deck[] {
    const decks = localStorage.getItem(this.localStorageKey);
    return decks ? JSON.parse(decks) : [];
  }

  getDeck(id: string): Deck | null {
    const decks = this.getDecks();
    return decks.find(deck => deck.id === id) || null;
  }

  updateDeck(updatedDeck: Deck): void {
    console.log('Atualizando baralho:', updatedDeck);

    let decks = this.getDecks();
    decks = decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck);
    localStorage.setItem(this.localStorageKey, JSON.stringify(decks));
  }

  public getCardById(id: string): Observable<Card> {
    return this.http.get<{data: Card}>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erro ao buscar o card:', error);
        return of(null);
      })
    );
  }

  public getCardsWithOffsetAndLimit(offset: number, limit: number): Observable<Card[]> {
    const params = new HttpParams()
        .set('offset', offset.toString())
        .set('limit', limit.toString());

    return this.http.get<{data: Card[]}>(this.apiUrl, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Erro ao buscar os cards com offset e limit:', error);
        return of([]);
      })
    );
  }

  // Método para limpar o cache quando necessário
  public clearCache(): void {
    this.cache$ = null;
  }
}
