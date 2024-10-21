import { Component } from '@angular/core';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent {
  selectedProject: string = 'Project 1';
  selectedMonth: string = '2024-10';

  projects: string[] = ['Project 1', 'Project 2', 'Project 3'];

  days: number[] = [];
  employees: { name: string; hours: number[] }[] = [
    { name: 'Jane Doe', hours: [] },
    { name: 'John Doe', hours: [] },
    { name: 'Michael Smith', hours: [] },
  ];

  isEditing: boolean = false;
  originalHours: number[][] = [];

  constructor() {
    this.updateDays();
  }

  updateDays(): void {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const adjustedMonth = month - 1;
    const numDays = new Date(year, adjustedMonth + 1, 0).getDate();

    this.days = Array.from({ length: numDays }, (_, i) => i + 1);

    this.employees.forEach(employee => {
      employee.hours = Array(numDays).fill(0);
    });
  }

  onMonthChange(): void {
    this.updateDays();
  }

  startEditing(): void {
    this.originalHours = this.employees.map(e => [...e.hours]);
    this.isEditing = true;
    console.log('Edit mode enabled');
  }

  cancelEdit(): void {
    this.employees.forEach((employee, index) => {
      employee.hours = [...this.originalHours[index]];
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
    console.log(this.isEditing ? 'Edit mode enabled' : 'Edit mode cancelled');
  }

  save(): void {
    console.log('Hours saved:', this.employees);
    this.isEditing = false;
  }

  selectAll(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  updateHours(empIndex: number, hourIndex: number, value: number): void {
    if (value < 0) {
      console.error('Hours cannot be negative');
      return;
    }
    this.employees[empIndex].hours[hourIndex] = value;
    console.log(`Updated Employee - ${this.employees[empIndex].name} | Hour - ${hourIndex + 1}: ${value}`);
  }
}
