import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveBrandComponent } from './reactive-brand-component';

describe('ReactiveBrandComponent', () => {
  let component: ReactiveBrandComponent;
  let fixture: ComponentFixture<ReactiveBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactiveBrandComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
