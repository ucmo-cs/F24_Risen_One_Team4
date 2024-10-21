import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimesheetComponent } from './timesheet.component';

describe('TimesheetComponent', () => {
  let component: TimesheetComponent;
  let fixture: ComponentFixture<TimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimesheetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update days correctly', () => {
    component.selectedMonth = '2024-02'; // Set to February
    component.updateDays();
    expect(component.days.length).toBe(29); // Leap year check
  });
});
