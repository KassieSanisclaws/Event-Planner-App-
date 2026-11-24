import { TestBed } from "@angular/core/testing";
import { EventService } from "./event.service";
import { EventInput } from "../models/event.model";

describe('EventService', () => {
    let service: EventService;
    const storageKey = 'personal-event-planner-events';
    
    const testSampleEvent: EventInput = {
        title: 'Angular Event Workshop',
        description: "Practicing Angular Unit Testing",
        date: "2026-11-23",
        time: "6:00",
        location: "Trios Remote",
        category: "Work"
    };

    beforeEach(()=> {
        localStorage.removeItem(storageKey);
        TestBed.configureTestingModule({});
        service = TestBed.inject(EventService);
    });

    afterEach(() => {
        localStorage.removeItem(storageKey);
    })

    it("Should create service", () => {
        expect(service).toBeTruthy();
    });

    it('Should start with no events', () => {
        expect(service.events().length).toBe(0);
        expect(service.totalCount()).toBe(0);
    });

      it('should add a new event', () => {
    const created = service.addEvent(testSampleEvent);

    expect(created.id).toBeTruthy();
    expect(created.title).toBe('Angular Event Workshop');
    expect(created.completed).toBeFalsy();

    expect(service.events().length).toBe(1);
    expect(service.totalCount()).toBe(1);
  });

  it('should retrieve an event by ID', () => {
    const created = service.addEvent(testSampleEvent);

    const found = service.getEventById(created.id);

    expect(found).toBeDefined();
    expect(found?.title).toBe('Angular Event Workshop');
  });

  it('should update an existing event', () => {
    const created = service.addEvent(testSampleEvent);

    const updated = service.updateEvent(created.id, {
      ...testSampleEvent,
      title: 'Updated Angular Workshop'
    });

    const result = service.getEventById(created.id);

    expect(updated).toBe(true);
    expect(result?.title).toBe('Updated Angular Workshop');
  });

  it('should return false for a missing event', () => {
    const updated = service.updateEvent(
      'missing-event',
      testSampleEvent
    );

    expect(updated).toBeFalsy();
  });

  it('should mark an event as completed', () => {
    const created = service.addEvent(testSampleEvent);

    service.toggleCompleted(created.id);

    const result = service.getEventById(created.id);

    expect(result?.completed).toBe(true);
    expect(service.completedCount()).toBe(1);
  });

  it('should reopen a completed event', () => {
    const created = service.addEvent(testSampleEvent);

    service.toggleCompleted(created.id);
    service.toggleCompleted(created.id);

    const result = service.getEventById(created.id);

    expect(result?.completed).toBeFalsy();
    expect(service.completedCount()).toBe(0);
  });

  it('should delete an event', () => {
    const created = service.addEvent(testSampleEvent);

    service.deleteEvent(created.id);

    expect(service.getEventById(created.id)).toBeUndefined();
    expect(service.totalCount()).toBe(0);
  });

  it('should save events in localStorage', () => {
    service.addEvent(testSampleEvent);

    const saved = localStorage.getItem(storageKey);

    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved!);

    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe('Angular Event Workshop');
  });

  it('should count future unfinished events', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);

    const date = [
      futureDate.getFullYear(),
      String(futureDate.getMonth() + 1).padStart(2, '0'),
      String(futureDate.getDate()).padStart(2, '0')
    ].join('-');

    service.addEvent({
      ...testSampleEvent,
      date,
      time: '12:00'
    });

    expect(service.upcomingCount()).toBe(0);
  });
});