import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
selector: 'app-timesheet',
templateUrl: './timesheet.component.html',
styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
selectedProject: string = 'Project 1';
selectedMonth: string = new Date().toISOString().slice(0, 7);

  // Define your project data, each project with a list of employee names
projectsData = [
{ id: 1, name: 'Project 1', employees: ['John Doe', 'Johny Doe', 'Johnson Doe'] },
{ id: 2, name: 'Project 2', employees: ['Jane Doe', 'Janey Doe', 'Janson Doe'] },
{ id: 3, name: 'Project 3', employees: ['unknown', 'unanimous', 'unknown2'] },
];

selectedProjectId: number = 1; // Default to TJMaxx
employees: { name: string; hours: number[] }[] = []; // Will hold the filtered employees

days: number[] = [];

  // Initialize employees with some default data
originalHours: number[][] = [];

@ViewChild('timesheetContent', { static: false }) timesheetContent!: ElementRef;

isEditing: boolean = false;

constructor() {
this.updateDays();
}

ngOnInit(): void {
this.filterEmployees(); // Initialize employees based on the default project
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

onMonthChange(): void {
this.updateDays();
}

startEditing(): void {
this.originalHours = this.employees.map(e => [...e.hours]);
this.isEditing = true;
}

cancelEdit(): void {
this.employees.forEach((employee, index) => {
employee.hours = [...this.originalHours[index]];
});
this.isEditing = false;
}

getTotalHours(hours: number[]): number {
return hours.reduce((a, b) => a + b, 0);
}

exportToPDF() {
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

save(): void {
this.isEditing = false;
}

selectAll(event: FocusEvent): void {
const input = event.target as HTMLInputElement;
input.select();
}

updateHours(empIndex: number, hourIndex: number, value: number): void {
this.employees[empIndex].hours[hourIndex] = Math.max(0, Math.min(value, 24));
}

trackByMethod(index: number, el: any): number {
return el.id;
}
}
