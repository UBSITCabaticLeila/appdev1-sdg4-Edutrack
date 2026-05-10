import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectCardComponent, Subject } from './subject-card';

describe('SubjectCardComponent', () => {
  let component: SubjectCardComponent;
  let fixture: ComponentFixture<SubjectCardComponent>;

  const mockSubject: Subject = {
    name: 'APPDEV1 — Angular Development',
    chapter: 7,
    total: 12,
    progress: 58,
    color: '#1b6e4e',
    updated: 'Updated today'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectCardComponent);
    component = fixture.componentInstance;
    component.subject = mockSubject;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the subject name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('APPDEV1 — Angular Development');
  });

  it('should display the correct progress percentage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('58%');
  });
});