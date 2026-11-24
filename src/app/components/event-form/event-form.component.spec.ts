import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { EventInput } from '../../models/event.model';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should begin with an invalid form', () => {
    expect(component.eventForm.invalid).toBe(true);
  });

  it('should require a valid title', () => {
    const title = component.eventForm.controls.title;

    title.setValue('');
    expect(title.invalid).toBe(true);

    title.setValue('AB');
    expect(title.invalid).toBe(true);

    title.setValue('   ');
    expect(title.invalid).toBe(true);

    title.setValue('Family Dinner');
    expect(title.valid).toBe(true);
  });

  it('should require a date and time', () => {
    const controls = component.eventForm.controls;

    controls.title.setValue('Family Dinner');
    controls.date.setValue('');
    controls.time.setValue('');

    expect(component.eventForm.invalid).toBe(true);

    controls.date.setValue('2027-06-15');
    controls.time.setValue('18:30');

    expect(component.eventForm.valid).toBe(true);
  });

  it('should emit valid event data', () => {
    const expected: EventInput = {
      title: 'Birthday Party',
      description: 'Family celebration',
      date: '2027-08-12',
      time: '17:00',
      location: 'Home',
      category: 'Birthday'
    };

    spyOn(component.formSaved, 'emit');

    component.eventForm.setValue(expected);
    component.submitForm();

    expect(component.formSaved.emit)
      .toHaveBeenCalledWith(expected);
  });

  it('should not emit invalid event data', () => {
    spyOn(component.formSaved, 'emit');

    component.eventForm.controls.title.setValue('');
    component.submitForm();

    expect(component.formSaved.emit)
      .not.toHaveBeenCalled();
  });

  it('should populate fields when editing', () => {
    component.event = {
      id: 'test-001',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      date: '2027-04-10',
      time: '09:00',
      location: 'Clinic',
      category: 'Appointments',
      completed: false,
      createdAt: new Date().toISOString()
    };

    component.ngOnChanges();

    expect(component.eventForm.controls.title.value)
      .toBe('Doctor Appointment');

    expect(component.eventForm.controls.category.value)
      .toBe('Appointments');
  });

  it('should emit a cancellation event', () => {
    spyOn(component.cancelled, 'emit');

    component.cancel();

    expect(component.cancelled.emit)
      .toHaveBeenCalled();
  });
});