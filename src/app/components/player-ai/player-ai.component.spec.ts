import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAIComponent } from './player-ai.component';

describe('PlayerAIComponent', () => {
  let component: PlayerAIComponent;
  let fixture: ComponentFixture<PlayerAIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
