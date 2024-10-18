import { Component } from '@angular/core';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent {
  selectedProject: string = 'Project 1';
  selectedMonth: string = '2024-10'; // Set to a default YYYY-MM format

  projects: string[] = ['Project 1', 'Project 2', 'Project 3'];

  days: number[] = []; // Holds the days of the selected month

  employees: { name: string; hours: number[] }[] = [
    { name: 'Jane Doe', hours: [] },
    { name: 'John Doe', hours: [] },
    { name: 'Michael Smith', hours: [] },
  ];

  isEditing: boolean = false;

  constructor() {
    this.updateDays(); // Initialize days on component load
  }

  // Update days based on the selected month and year
  updateDays(): void {
    const [year, month] = this.selectedMonth.split('-').map(Number); // Parse year and month

    // Adjust month to be 0-based for Date
    const adjustedMonth = month - 1; // Adjusting to 0-based index
    const numDays = new Date(year, adjustedMonth + 1, 0).getDate(); // Get total days in the month

    this.days = Array.from({ length: numDays }, (_, i) => i + 1); // Populate days array

    // Initialize hours for all employees
    this.employees.forEach(employee => {
      employee.hours = Array(numDays).fill(0);
    });
  }

  // Triggered when the month input changes
  onMonthChange(): void {
    this.updateDays(); // Recalculate days when the month changes
  }

  // Temporary storage for original hours during edit mode
  originalHours: number[][] = [];

  // Enter edit mode and store original hours
  startEditing(): void {
    this.originalHours = this.employees.map(e => [...e.hours]); // Store a deep copy
    this.isEditing = true;
    console.log('Edit mode enabled');
  }

  // Cancel editing and restore original hours
  cancelEdit(): void {
    this.employees.forEach((employee, index) => {
      employee.hours = [...this.originalHours[index]]; // Restore original hours
    });
    this.isEditing = false;
    console.log('Edit mode cancelled');
  }

  getTotalHours(hours: number[]): number {
    return hours.reduce((a, b) => a + b, 0);
  }

  exportToPDF() {
    console.log('Exporting to PDF');
  }

  edit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      console.log('Edit mode enabled');
    } else {
      console.log('Edit mode cancelled');
    }
  }

  save(): void {
    console.log('Hours saved:', this.employees);
    if (this.isEditing) {
      console.log("Edit mode disabled");
    }
    this.isEditing = false; // Turn off edit mode after saving
  }

  selectAll(event: FocusEvent): void {
    const input = event.target as HTMLInputElement; // Type cast to HTMLInputElement
    input.select(); // Select the input field's content
  }

  updateHours(empIndex: number, hourIndex: number, value: number): void {
    this.employees[empIndex].hours[hourIndex] = value;
    console.log(`Updated Employee - ${this.employees[empIndex].name} | Hour - ${hourIndex + 1}: ${value}`);
  }
}
