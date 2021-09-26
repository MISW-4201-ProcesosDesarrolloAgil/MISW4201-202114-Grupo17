/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CancionShareComponent } from './cancion-share.component';

describe('CancionShareComponent', () => {
  let component: CancionShareComponent;
  let fixture: ComponentFixture<CancionShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancionShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
