import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CardComponent } from './components/card/card.component';
import { DeckDetailsComponent } from './components/deck-details/deck-details.component';
import { DeckFormComponent } from './components/deck-form/deck-form.component';
import { CardAddComponent } from './components/card-add/card-add.component';
import { DeckEditComponent } from './components/deck-edit/deck-edit.component';
import { GameBoardComponent } from './components/game-board/game-board.component';



const routes: Routes = [
  { path: 'header', component: HeaderComponent },
  { path: '', redirectTo: '/card', pathMatch: 'full' },
  { path: 'card', component: CardComponent },
  { path: 'card', component: CardComponent },
  { path: 'deck/:id', component: DeckDetailsComponent },
  { path: 'create-deck', component: DeckFormComponent },
  { path: 'create-cards', component: CardAddComponent },
  { path: 'edit-deck', component: DeckEditComponent },
  { path: 'topo', component: HeaderComponent },
  { path: 'play-game', component: GameBoardComponent  }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
