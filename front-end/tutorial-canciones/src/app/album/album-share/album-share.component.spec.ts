import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumShareComponent } from './album-share.component';

describe('AlbumShareComponent', () => {
  let component: AlbumShareComponent;
  let fixture: ComponentFixture<AlbumShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
