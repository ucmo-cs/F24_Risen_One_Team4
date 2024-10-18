import { Component } from '@angular/core';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent {
  selectedProject: string = 'Project 1';
  selectedMonth: string = 'February 2024';

  projects: string[] = ['Project 1', 'Project 2', 'Project 3'];

  days = Array.from({ length: 28 }, (_, i) => i + 1); // Days of February 2024

  employees = [
    { name: 'Jane Doe', hours: Array(28).fill(0)},
    { name: 'John Doe', hours: Array(28).fill(0)},
    { name: 'Michael Smith', hours: Array(28).fill(0)},
  ];

  isEditing: boolean = false; // Toggle for edit mode

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

  save() : void {
    console.log('Hours saved:', this.employees);
    if (this.isEditing)
      console.log("Edit mode disabled")
    this.isEditing = false;// Turn off edit mode after saving
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
