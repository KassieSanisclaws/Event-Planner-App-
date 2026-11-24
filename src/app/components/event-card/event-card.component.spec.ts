
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventCardComponent } from './event-card.component';
import { PlannerEvent } from '../../models/event.model';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  const sampleEvent: PlannerEvent = {
    id: 'event-001',
    title: 'Team Meeting',
    description: 'Discuss project milestones',
    date: '2027-15-07',
    time: '13:30',
    location: 'Office',
    category: 'Work',
    completed: false,
    createdAt: '2027-01-01T12:00:00.000Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;

    component.event = { ...sampleEvent };

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the event title', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent)
      .toContain('Team Meeting');
  });

  it('should display the event category', () => {
    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent)
      .toContain('Work');
  });

  it('should emit the ID when completion is requested', () => {
    spyOn(component.completionRequested, 'emit');

    component.toggleCompleted();

    expect(component.completionRequested.emit)
      .toHaveBeenCalledWith('event-001');
  });

  it('should emit the ID when deletion is requested', () => {
    spyOn(component.deleteRequested, 'emit');

    component.requestDelete();

    expect(component.deleteRequested.emit)
      .toHaveBeenCalledWith('event-001');
  });

  it('should show the completed status', () => {
    component.event = {
      ...sampleEvent,
      completed: true
    };

    fixture.detectChanges();

    const element: HTMLElement =
      fixture.nativeElement;

    expect(element.textContent)
      .toContain('Completed');
  });
});
