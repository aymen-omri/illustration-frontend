import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationDetailsComponent } from './illustration-details.component';

describe('IllustrationDetailsComponent', () => {
  let component: IllustrationDetailsComponent;
  let fixture: ComponentFixture<IllustrationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IllustrationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustrationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
