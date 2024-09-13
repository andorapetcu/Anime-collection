import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeCollectionComponent } from './anime-collection.component';

describe('AnimeCollectionComponent', () => {
  let component: AnimeCollectionComponent;
  let fixture: ComponentFixture<AnimeCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimeCollectionComponent]
    });
    fixture = TestBed.createComponent(AnimeCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
