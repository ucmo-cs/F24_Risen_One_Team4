import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
})
export class TimesheetComponent implements OnInit {
  selectedProject: string = 'Project 1'; // Default project
  selectedProjectId: number = 1; // Default project ID
  selectedMonth: string = new Date().toISOString().slice(0, 7); // Default month (current month)
  projects: string[] = ['Project 1', 'Project 2', 'Project 3']; // List of project names
  projectsData = [
    { id: 1, name: 'Project 1', employees: ['John Doe', 'Jane Doe', 'Michael Smith'] },
    { id: 2, name: 'Project 2', employees: ['Alice Johnson', 'Bob Brown', 'Chris Green'] },
    { id: 3, name: 'Project 3', employees: ['Tom Lee', 'Sarah White', 'Liam Black'] },
  ]; // List of project data with employees

  days: number[] = []; // Days of the selected month
  employees: { name: string; hours: number[] }[] = []; // List of employees working on the selected project
  originalHours: number[][] = []; // To store the original hours when editing
  isEditing: boolean = false; // Flag to toggle between view and edit mode

  @ViewChild('timesheetContent', { static: false }) timesheetContent!: ElementRef;

  constructor() {
    this.updateDays(); // Initialize days and employees when component loads
  }

  ngOnInit(): void {
    this.filterEmployees(); // Filter employees based on the default project
  }

  // Filter employees based on the selected project
  filterEmployees(): void {
    const project = this.projectsData.find(p => p.id === this.selectedProjectId);
    if (project) {
      this.employees = project.employees.map(name => ({
        name,
        hours: Array(this.days.length).fill(0), // Initialize hours for each employee
      }));
    }
  }

  // Update days based on selected month
  updateDays(): void {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const adjustedMonth = month - 1;
    const numDays = new Date(year, adjustedMonth + 1, 0).getDate();
    this.days = Array.from({ length: numDays }, (_, i) => i + 1);

    // Re-initialize hours when days are updated
    this.employees.forEach(employee => {
      employee.hours = Array(numDays).fill(0);
    });
  }

  // Called when the month changes
  onMonthChange(): void {
    this.updateDays();
  }

  // Start editing the timesheet
  startEditing(): void {
    this.originalHours = this.employees.map(e => [...e.hours]);
    this.isEditing = true;
  }

  // Cancel the edit mode and revert hours to original
  cancelEdit(): void {
    this.employees.forEach((employee, index) => {
      employee.hours = [...this.originalHours[index]];
    });
    this.isEditing = false;
  }

  // Get the total hours for an employee
  getTotalHours(hours: number[]): number {
    return hours.reduce((a, b) => a + b, 0);
  }

  // Export timesheet to PDF
  exportToPDF(): void {
    const element = this.timesheetContent.nativeElement;
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 2 * 10;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const formattedMonth = this.formatMonthYear(this.selectedMonth);
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${this.selectedProject}_${formattedMonth}_timesheet.pdf`);
    });
  }

  // Format month and year to a readable format (e.g., "January 2024")
  get formattedSelectedMonth(): string {
    return this.formatMonthYear(this.selectedMonth);
  }

  formatMonthYear(dateStr: string): string {
    const [year, month] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  // Save the changes (for now, it just disables the editing mode)
  save(): void {
    this.isEditing = false;
  }

  // Select all input text when focusing on a number input field
  selectAll(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  // Update the hours for a specific employee and day
  updateHours(empIndex: number, hourIndex: number, value: number): void {
    this.employees[empIndex].hours[hourIndex] = Math.max(0, Math.min(value, 24));
  }

  // Track by method for efficient rendering
  trackByMethod(index: number, el: any): number {
    return el.id;
  }
}
