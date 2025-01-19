import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCallComponent } from './main-call.component';

describe('MainCallComponent', () => {
  let component: MainCallComponent;
  let fixture: ComponentFixture<MainCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
