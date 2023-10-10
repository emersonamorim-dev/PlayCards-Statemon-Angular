import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerUserComponent } from './player-user.component';

describe('PlayerUserComponent', () => {
  let component: PlayerUserComponent;
  let fixture: ComponentFixture<PlayerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
