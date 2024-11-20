import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


interface Employee {
  name: string;
  hours: number[];
}

interface Timesheet {
  username: string;
  projectName: string;
  selectMonth: string;
  employeesList: Employee[];
  managerSignature:string;
  date:string
}

interface TimesheetResponse {
  username: string;
  data:{
    projectName: string;
    selectMonth: string;
    employeesList: Employee[];
    managerSignature:string;
    date:string
  }
}

@Injectable({
  providedIn: 'root'
})
export class DynamoDBService {
  // apiUrl: string = "https://1ytxch96rd.execute-api.us-east-1.amazonaws.com/dev/";
  apiUrl: string = "http://localhost:3000/dev";
  constructor(private http: HttpClient) {}

  getTimesheet(username: string): Observable<Timesheet> {
    return this.http.get<Timesheet>(`${this.apiUrl}/timesheet/${username}`).pipe(
      catchError(error => {
        console.error('Error fetching timesheet:', error);
        return throwError(() => new Error('Failed to fetch timesheet'));
      })
    );
  }

  upsertTimesheet(timesheet: Timesheet): Observable<any> {
    return this.http.post(`${this.apiUrl}/timesheet`, timesheet).pipe(
      catchError(error => {
        console.error('Error saving timesheet:', error);
        return throwError(() => new Error('Failed to save timesheet'));
      })
    );
  }
}