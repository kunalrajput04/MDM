import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Ensure correct HttpClient import
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DashBoardChartStatus } from '../Model/dash-board-chart-status';
import { DashboardCharts } from '../Model/dashboard-charts';
import { MeterDatas, RecentInstantData, LogDatas } from '../Model/meter-data';

@Injectable({
  providedIn: 'root',
})
export class CommunicationmeterService {



 apikey: any;

  getdata: MeterDatas = new MeterDatas();
  getrecentdata: RecentInstantData = new RecentInstantData();
  logdata: LogDatas = new LogDatas();
  getchart: DashboardCharts = new DashboardCharts();
  getchartstatus: DashBoardChartStatus = new DashBoardChartStatus();

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getMeterReport(payload: any) {
    const apiKey = localStorage.getItem('apikey') || ''; // Retrieve the API key
    if (!apiKey) {
      console.error('API Key is missing or invalid'); // Log if the API key is missing
      return throwError(() => new Error('API Key is missing or invalid')); // Updated throwError syntax
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Ensure Content-Type is set
        apiKey: apiKey, // Ensure apiKey is not null
      }),
    };

    console.log('API Key being sent:', apiKey); // Log the API key
    console.log('Payload being sent:', JSON.stringify(payload, null, 2)); // Log the payload in a readable format
    console.log('Headers being sent:', httpOptions.headers); // Log the headers

    return this.http
      .post(
        'https://meghasmarts.com:6005/Evit/getLastCommDevicesList', // Hardcoded API URL
        payload, // Ensure payload is sent as an object
        httpOptions // Pass options correctly
      )
      .pipe(
        tap((response) => console.log('API Response:', response)), // Log the API response
        catchError((error) => {
          console.error('API Error:', error); // Log any errors
          return throwError(() => error); // Updated throwError syntax
        })
      );
  }

  // Add methods or properties as needed
}
