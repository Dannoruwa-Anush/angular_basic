import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDrivenBrandComponent } from './template-driven-brand-component';

describe('TemplateDrivenBrandComponent', () => {
  let component: TemplateDrivenBrandComponent;
  let fixture: ComponentFixture<TemplateDrivenBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateDrivenBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateDrivenBrandComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
