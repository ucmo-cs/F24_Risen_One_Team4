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

  days = Array.from({ length: 29 }, (_, i) => i + 1); // Days of February 2024

  employees = [
    { name: 'Jane Doe', hours: Array(29).fill(4) },
    { name: 'John Doe', hours: Array(27).fill(4).concat([0, 0]) },
    { name: 'Michael Smith', hours: Array(29).fill(4) },
  ];

  getTotalHours(hours: number[]): number {
    return hours.reduce((a, b) => a + b, 0);
  }

  exportToPDF() {
    console.log('Exporting to PDF');
  }

  edit() {
    console.log('Edit mode activated');

  }

  save() {
    console.log('Data saved');

  }
}
