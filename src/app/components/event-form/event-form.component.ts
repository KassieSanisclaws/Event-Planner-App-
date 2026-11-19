import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventCategory, EventInput, PlannerEvent, EVENT_CATEGORIES } from '../../models/event.model';

function nonBlankValidator(
  control: AbstractControl 
): ValidationErrors | null {
  const value = String(control.value ?? '');

  return value.trim().length > 0 ? null : { blank: true }
}

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})

export class EventFormComponent implements OnChanges {
 @Input() event?: PlannerEvent;

  @Output() formSaved = new EventEmitter<EventInput>();
  @Output() cancelled = new EventEmitter<void>();

  readonly categories = EVENT_CATEGORIES;

  readonly eventForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        nonBlankValidator,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]
    }),

    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(1000)
      ]
    }),

    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),

    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(150)]
    }),

    category: new FormControl<EventCategory>('Personal', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnChanges(): void {
    if (this.event) {
      this.eventForm.reset({
        title: this.event.title,
        description: this.event.description,
        date: this.event.date,
        time: this.event.time,
        location: this.event.location,
        category: this.event.category
      });
    }
  }

  submitForm(): void {
    this.eventForm.markAllAsTouched();

    if (this.eventForm.invalid) {
      return;
    }

    const values = this.eventForm.getRawValue();

    const input: EventInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      date: values.date,
      time: values.time,
      location: values.location.trim(),
      category: values.category
    };

    if (!input.title) {
      this.eventForm.controls.title.setErrors({
        blank: true
      });
      return;
    }

    this.formSaved.emit(input);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
