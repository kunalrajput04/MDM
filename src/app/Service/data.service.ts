import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DashBoardChartStatus } from '../Model/dash-board-chart-status';
import { DashboardCharts } from '../Model/dashboard-charts';
import { DeviceData, LogDatas, MeterDatas } from '../Model/meter-data';
import { RecentInstantData } from '../Model/meter-datas';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  getdata: MeterDatas = new MeterDatas();
  devicedata: DeviceData = new DeviceData();
  getrecentdata: RecentInstantData = new RecentInstantData();
  logdata: LogDatas = new LogDatas();
  getchart: DashboardCharts = new DashboardCharts();
  getchartstatus: DashBoardChartStatus = new DashBoardChartStatus();

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.devicedata = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue'),
    };

    this.getdata = {
      level_name: localStorage.getItem('AccessLevel'),
      level_value: localStorage.getItem('AccessValue'),
      start_date: '',
      end_date: '',
    };
    this.getrecentdata = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue'),
      date: '',
    };

    this.getchart = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue'),
      startDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      commandType: '',
    };

    this.getchartstatus = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue'),
      startDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      commandType: '',
      status: '',
    };
  }

  getInstantData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` + meterPhase + `/getInstantData/` + ``,
      this.getdata
    );
  }

  getDashboard() {
    let data = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue'),
    };

    return this.http.post(`${environment.smartapiUrl}/Evit/getDashboard`, data);
  }

  getMapDataForRevenue() {
    let obj = {
      levelName: localStorage.getItem('AccessLevel'),
      levelValue: localStorage.getItem('AccessValue'),
    };

    return this.http.post(
      `${environment.smartapiUrl}/Evit/dashboardDetails/`,
      obj
    );
  }

  getDailyLoadProfileData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` +
        meterPhase +
        `/getDailyLoadProfileData/` +
        ``,
      this.getdata
    );
  }
  getDailyLoadProfileDataForChart(
    fromdate: any,
    todate: any,
    levelName: string,
    levelvalue: string
  ) {
    this.getdata.level_name = levelName;
    this.getdata.level_value = levelvalue;

    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` +
        meterPhase +
        `/getDailyLoadProfileData/` +
        ``,
      this.getdata
    );
  }

  getEventData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` + meterPhase + `/getEventData` + ``,
      this.getdata
    );
  }

  getLoadProfileData(fromdate: string, todate: string, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }

    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` + meterPhase + `/getLoadProfileData/` + ``,
      this.getdata
    );
  }

  getBillingData(fromdate: string, todate: string, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null) {
      meterPhase = 'Evit';
    }

    return this.http.post(
      `${environment.smartapiUrl}/` + meterPhase + `/getBillingData/` + ``,
      this.getdata
    );
  }

  getCommReportChartData(levelname: string, levelvalue: string) {
    let bodyData = {
      levelName: levelname,
      levelValue: levelvalue,
    };

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getDeviceDatasetsComm`,
      bodyData
    );
  }

  getDashboardChartComman() {
    let bodyData = {
      levelValue: localStorage.getItem('AccessValue'),
    };

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getMeterCommCount/`,
      bodyData
    );
  }

  getDeviceListForMap(levelvalue: string) {
    this.devicedata.levelName = 'DT';
    this.devicedata.levelValue = levelvalue;
    let meterPhase = 'Evit';

    return this.http.post(
      `${environment.smartapiUrl}/` + meterPhase + `/getDevice` + ``,
      this.devicedata
    );
  }

  getDeviceList(meterNo: string) {
    let data = null;
    if (meterNo != '') {
      data = {
        levelName: 'METER',
        levelValue: meterNo,
      };
    } else {
      data = {
        levelName: this.devicedata.levelName,
        levelValue: this.devicedata.levelValue,
      };
    }

    return this.http.post(`${environment.smartapiUrl}/Evit/getMDMDevice`, data);
  }
  connectDisconnect(Command: any, DeviceSerialNo: any) {
    let data = {
      commandName: Command,
      device: DeviceSerialNo,
    };

    return this.http.post(
      `${environment.smartapiUrl}/Evit/directOnMeterCmd/`,
      data
    );
  }
  connectDisconnectFullData(Command: any, DeviceSerialNo: any) {
    let data = {
      commandName: Command,
      device: DeviceSerialNo,
    };

    return this.http.post(`${environment.smartapiUrl}/Evit/addCommand`, data);
  }

  getCommandLogData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }

    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getCommandsLogs`,
      this.getdata
    );
  }

  getNamePlate(meterNo: string) {
    let body = {
      levelName: '',
      levelValue: '',
    };
    if (meterNo != '') {
      body = {
        levelName: 'METER',
        levelValue: meterNo,
      };
    } else {
      body = {
        levelName:
          localStorage.getItem('AccessLevel') == 'ALL'
            ? 'All'
            : localStorage.getItem('AccessLevel'),
        levelValue: localStorage.getItem('AccessValue'),
      };
    }

    return this.http.post(
      `${environment.smartapiUrl}` + `/Evit/getNamePlate/` + ``,
      body
    );
  }

  getDashboardChartList(date: string) {
    this.getchartstatus.commandType = 'LastComm';
    this.getchartstatus.status = 'Failure';
    this.getchartstatus.levelName = localStorage.getItem('AccessLevel');
    this.getchartstatus.levelValue = localStorage.getItem('AccessValue');
    this.getchartstatus.startDate = date;

    return this.http.post(
      `${environment.smartapiUrl}/Evit/getCommCountDevicesList/`,
      this.getchartstatus
    );
  }

  getConfigrationReportData(fromdate: any, todate: any) {
    this.getdata.level_name = localStorage.getItem('AccessLevel');
    this.getdata.level_value = localStorage.getItem('AccessValue');
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getConfigurations`,
      this.getdata
    );
  }
  getAllCommandLogs(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }

    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getFullDataCommandLogs`,
      this.getdata
    );
  }

  getSMSLog(fromdate: any, todate: any, meterNo: string) {
    let data = {
      ACCOUNT_NO: meterNo,
      FROM_DATE: fromdate,
      TO_DATE: todate,
    };
    return this.http.post(
      `${environment.apiUrl}InstantDemand/ConsumerAlertList`,
      data
    );
  }
  getCommandLogChartData(fromdate: any, todate: any) {
    this.logdata.levelName = localStorage.getItem('AccessLevel');
    this.logdata.levelValue = localStorage.getItem('AccessValue');
    this.logdata.startDate = fromdate;
    this.logdata.endDate = todate;

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getDeviceCommandLogsCount`,
      this.logdata
    );
  }
  getFirmwareLogs(fromdate: any, todate: any) {
    let data = {
      level_name: localStorage.getItem('AccessLevel'),
      level_value: localStorage.getItem('AccessValue'),
      start_date: fromdate,
      end_date: todate,
    };

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getFirmwareLogs`,
      data
    );
  }
  getFullConfigLog(fromdate: any, todate: any) {
    let data = {
      level_name: localStorage.getItem('AccessLevel'),
      level_value: localStorage.getItem('AccessValue'),
      start_date: fromdate,
      end_date: todate,
    };

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getFullConfigLogs`,
      data
    );
  }

  getMeterStatusLogData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('AccessLevel');
      this.getdata.level_value = localStorage.getItem('AccessValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.smartapiUrl}/Reports/getMeterStatusCommandLogs/` + ``,
      this.getdata,
      httpOptions
    );
  }

  //  System SLA History Report
  slaHistory(data:any){
    const httpOptions = {
      headers: new HttpHeaders({
        // apiKey:"NTM3NTYzNjM2NTczNzM6MTY4NjEzODAwMjg3NDpocnh0cjI2NzhiNjc1NTZkYmd2a3A2ODZreXlwYg==",
        apiKey: localStorage.getItem('apikey'),
      }),
    }
    return this.http.post(
      `${environment.slaUrl}/getSystemSLA`,
      data,httpOptions
    );
  }

  // SLA History 
  slaDataOfHistory(data:any){
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    }
    return this.http.post(
      `${environment.slaUrl2}/getMonthlySLANew`,
      data,httpOptions
    );
  }
  getSLAReportHistoryData(
    levelname: string,
    levelvalue: string,
    startdate: string,
    enddate: string
  ) {
    let bodyData = {
      level_name: levelname,
      level_value: levelvalue,
      start_date: startdate,
      end_date: enddate,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `https://meghasmarts.com:8443/sla2/rest/Evit/getMonthlySLANew`,
      bodyData,
      httpOptions
    );
  }
  systemDataLog(data:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        apiKey: localStorage.getItem('apikey'),
      }),
    }
    return this.http.post(
      `${environment.serverUrl1}/SystemCheck`,
      data,httpOptions
    );
  }
  getSystemLog1(sysData:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        apiKey: localStorage.getItem('apikey'),
      })
    };

    return this.http.get(`${environment.serverUrl1}/api/SystemCheck`, httpOptions);
  }
  getSystemLog(
    levelname: string,
    levelvalue: string,
    startdate: string,
    enddate: string
  ) {
    let bodyData = {
      level_name: levelname,
      level_value: levelvalue,
      start_date: startdate,
      end_date: enddate,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `https://meghasmarts.com:5066/api/SystemCheck`,
      bodyData,
      httpOptions
    );
  }
}
