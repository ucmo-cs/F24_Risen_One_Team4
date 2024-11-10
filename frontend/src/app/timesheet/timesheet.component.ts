import {Component, ElementRef, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent {
  selectedProject: string = 'Project 1';
  selectedMonth: string = new Date().toISOString().slice(0, 7);

  projects: string[] = ['Project 1', 'Project 2', 'Project 3'];

  days: number[] = [];

  employees: { name: string; hours: number[] }[] = [
    { name: 'Jane Doe', hours: [] },
    { name: 'John Doe', hours: [] },
    { name: 'Michael Smith', hours: [] },
  ];

  @ViewChild('timesheetContent', { static: false }) timesheetContent!: ElementRef;


  isEditing: boolean = false;

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
  originalHours: number[][] = [];

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
    console.log('Exporting to PDF...');
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
      pdf.save(`${this.selectedProject}_${this.formattedSelectedMonth}_timesheet.pdf`);
    });
  }

  get formattedSelectedMonth(): string {
    return this.formatMonthYear(this.selectedMonth);
  }

  formatMonthYear(dateStr: string): string {
    const [year, month] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
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
    this.isEditing = false;
  }

  selectAll(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  updateHours(empIndex: number, hourIndex: number, value: number): void {
    this.employees[empIndex].hours[hourIndex] = value;
    console.log(`Updated Employee - ${this.employees[empIndex].name} | Hour - ${hourIndex + 1}: ${value}`);
  }
}
