import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialFeed } from './social-feed';

describe('SocialFeed', () => {
  let component: SocialFeed;
  let fixture: ComponentFixture<SocialFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialFeed],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialFeed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
