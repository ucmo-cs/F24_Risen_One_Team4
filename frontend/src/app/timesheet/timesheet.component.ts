import { Component, OnInit } from '@angular/core';
import { DynamoDBService } from '../services/dynamo-db.service';

interface Employee {
  name: string;
  hours: number[];
}

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  selectedProject: string = 'Project 1';
  selectedMonth: string = '2024-10';
  username: string = localStorage.getItem('username') || '';

  projects: string[] = ['Project 1', 'Project 2', 'Project 3'];
  days: number[] = [];
  employees: Employee[] = [
    { name: 'Employee 1', hours: Array(31).fill(0) },
    { name: 'Employee 2', hours: Array(31).fill(0) },
    { name: 'Employee 3', hours: Array(31).fill(0) }
  ]; // Default employees with 31 days of 0 hours each
  isEditing: boolean = false;
  originalHours: number[][] = [];

  constructor(private timesheetService: DynamoDBService) {}

  ngOnInit(): void {
    this.updateDays();
    this.loadTimesheet();
  }

  updateDays(): void {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const numDays = new Date(year, month, 0).getDate();
    this.days = Array.from({ length: numDays }, (_, i) => i + 1);

    // Adjust each employee's hours array to match the number of days
    this.employees = this.employees.map(employee => ({
      ...employee,
      hours: [...employee.hours.slice(0, numDays), ...Array(numDays - employee.hours.length).fill(0)]
    }));
  }

  onMonthChange(): void {
    this.updateDays();
    this.loadTimesheet();
  }

  loadTimesheet(): void {
    this.timesheetService.getTimesheet(this.username)
      .subscribe(
        data => {
          if (data) {
            this.selectedProject = data.projectName;
            this.selectedMonth = data.selectMonth;
            this.updateDays();

            this.employees = data.employeesList.map(employee => ({
              ...employee,
              hours: [...employee.hours.slice(0, this.days.length), ...Array(this.days.length - employee.hours.length).fill(0)]
            }));
          }
        },
        error => {
          console.error('Error loading timesheet', error);
        }
      );
  }

  startEditing(): void {
    this.originalHours = this.employees.map(e => [...e.hours]);
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.employees.forEach((employee, index) => employee.hours = [...this.originalHours[index]]);
    this.isEditing = false;
  }

  getTotalHours(hours: number[]): number {
    return hours.reduce((a, b) => a + b, 0);
  }

  save(): void {
    const timesheetData = {
      username: this.username,
      projectName: this.selectedProject,
      selectMonth: this.selectedMonth,
      employeesList: this.employees,
      managerSignature: "",
      date: ""
    };
    
    this.timesheetService.upsertTimesheet(timesheetData).subscribe(
      () => {
        console.log('Timesheet saved successfully');
        this.isEditing = false;
      },
      error => {
        console.error('Error saving timesheet', error);
      }
    );
  }

  updateHours(empIndex: number, hourIndex: number, value: number): void {
    this.employees[empIndex].hours[hourIndex] = value;
  }
}
