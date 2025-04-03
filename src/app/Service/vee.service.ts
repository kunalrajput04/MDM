import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RuleRequestModel } from '../Model/rule-request-model';
import { VeeRules } from '../Model/vee-rules';

@Injectable({
  providedIn: 'root',
})
export class VeeService {
  formData1: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private http: HttpClient) {}

  // *************************************
  getAll() {
    const httpOptions = {
      headers: new HttpHeaders({
        userName: localStorage.getItem('Name'),
      }),
    };
    return this.http.get(
      `${environment.veeapiUrl}rules/getRuleNameList`,
      httpOptions
    );
  }
  addRule(formData: RuleRequestModel) {
    let obj = {
      'Rule Name': formData.ruleName,
      'User Name': formData.userName,
      'Dataset Name': formData.datasetName,
      'Dataset Param Name': formData.datasetParamName,
      'Level Applied': formData.levelApplied,
      'Level Name': formData.userName,
      Phase: formData.phase,
      'Rule Status': formData.ruleStatus,
      'Value Check': formData.valueCheck,
      'Value Estimation': formData.valueEstimation,
    };

    return this.http.post(`${environment.veeapiUrl}rules/save`, obj);
  }
  updateRule(formData: RuleRequestModel) {
    let obj = {
      'Rule Name': formData.ruleName,
      'User Name': formData.userName,
      'Dataset Name': formData.datasetName,
      'Dataset Param Name': formData.datasetParamName,
      'Level Applied': formData.levelApplied,
      'Level Name': formData.userName,
      Phase: formData.phase,
      'Rule Status': formData.ruleStatus,
      'Value Check': formData.valueCheck,
      'Value Estimation': formData.valueEstimation,
    };
    return this.http.put(`${environment.veeapiUrl}rules/update`, obj);
  }
  deleteRule(ruleName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        ruleName: ruleName,
        userName: localStorage.getItem('Name'),
      }),
    };
    return this.http.delete(
      `${environment.veeapiUrl}rules/delete`,
      httpOptions
    );
  }
  getRuleByName(ruleName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        ruleName: ruleName,
        userName: localStorage.getItem('Name'),
      }),
    };
    return this.http.get(`${environment.veeapiUrl}rules/get`, httpOptions);
  }

  getDataSet() {
    return this.http.get(`${environment.veeapiUrlGetData}list`);
  }

  getDataParams(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        datasetName: data,
      }),
    };

    return this.http.get(
      `${environment.veeapiUrlGetData}params/list`,
      httpOptions
    );
  }

  getappliedRules(data: VeeRules) {
    //  let dataa=  {
    //       "ruleName": "Billing Cumulative Check",
    //       "userName": "MPDCL",
    //       "startDate": "2021-10-01 00:00:00",
    //       "endDate": "2022-01-09 00:00:00"
    //   }
    return this.http.post(
      `${environment.megaSmart}validate/data/applyRules`,
      data
    );
  }
  // Create Validation Rule*****************************************************************
  // **********************************

  addNewData(userData: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/CreateValidationRule`,
      userData
    );
  }

  ViewListData() {
    return this.http.get(
      `${environment.serverNewUrl}/Validation/GetValidationRule`
    );
  }

  deleteRecord(deleteData: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/DeleteValidationRule/` +
        deleteData.id,
      deleteData
    );
  }

  EditRecord(selectData: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/EditValidationRule`,
      selectData
    );
  }

  // Daily Load Data******************************************************************

  addDailyLoadData() {
    return this.http.get(
      `${environment.serverNewUrl}/DailyLoad/getAllDLPOutputData`
    );
  }

  addDailyMixedLoadData() {
    return this.http.get(
      `${environment.serverNewUrl}/DailyLoad/getDailyLoadMixedOutPut`
    );
  }
  // Monthly Load Data**************************************************************************

  addMonthlyLoadData() {
    return this.http.get(
      `${environment.serverNewUrl}/Validation/getMontlyValidationReport`
    );
  }
  // MonthlyMIxedLoadDATA*********************************
  addMonthlyMixedLoadData() {
    return this.http.get(
      `${environment.serverNewUrl}/validation/getMontlyValidationMixedReport`
    );
  }

  // Run Daily DLP DATA*******************************************************************************

  // RunValidationRule(rule: any) {
  //   return this.http.post(
  //     `${environment.serverNewUrl}/DailyLoad/DailyLoadDecendingRule`,

  //     { params: rule }
  //   );
  // }
  RunValidationRule(rule: any) {
    return this.http.post(
      `${environment.serverNewUrl}/DailyLoad/DLPSPDecendingRule?vruleid=` +
        rule?.vruleid,
      {}
    );
  }

  RunValidationRule2(rule2: any) {
    return this.http.post(
      `${environment.serverNewUrl}/DailyLoad/MaxThreshold`,
      {},
      { params: rule2 }
    );
  }

  RunValidationRule3(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/DailyLoad/CompareKWhKVH`,
      {},
      { params: rule3 }
    );
  }
  // Daily-Mixed*************************

  RunMixedDailyDlpDESC(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/DailyLoad/DailyLoadMixedDecendingRule`,
      {},
      { params: rule3 }
    );
  }

  RunMixedDailyDlpKVH(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/DailyLoad/CompareMixedMeterKWhKVH`,
      {},
      { params: rule3 }
    );
  }

  RunMixedDailyDlpMAX(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/DailyLoad/MixedMeterMaxThreshold`,
      {},
      { params: rule3 }
    );
  }

  // Run Monthly Billing DATA*******************************************************************************

  RunValidationBillingRule(rule: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/MonthlyBillDecendingRule`,
      {},
      { params: rule }
    );
  }

  RunValidationBillingRule2(rule2: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/BillMonthlyMaxThreshold`,
      {},
      { params: rule2 }
    );
  }

  RunValidationBillingRule3(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/BillMonthlyCompareKWhKVH`,
      {},
      { params: rule3 }
    );
  }

  RunValidationBillingRule4PF(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/BillPFLowThreshold`,
      {},
      { params: rule3 }
    );
  }
  // Monthly-Mixed*************************

  RunMixedMonthlyBillingDesc(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/MonthlyBillMixedDecendingRule`,
      {},
      {
        params: rule3,
      }
    );
  }

  RunMixedMonthlyBillingMax(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/BillMonthlyMixedMeterMaxThreshold`,
      {},
      {
        params: rule3,
      }
    );
  }

  RunMixedMonthlyBillingKVH(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/BillMixedCompareKWHKVHData`,
      {},
      {
        params: rule3,
      }
    );
  }

  RunMixedMonthlyBillingPF(rule3: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Validation/BillMixedPFLowThreshold`,
      {},
      {
        params: rule3,
      }
    );
  }
  //Insert API *********************************************************************
  inserData(data: any) {
    return this.http.post(
      `${environment.serverUrl}/DailyLoad/DailyDLPDataInsert`,
      data
    );
  }

  // DASHBOARD-Table1 APIs*********************************************************************************
  meterDataDSHB(data: any) {
    return this.http.post(
      `${environment.smartapiUrl}/Evit/getMetersCommCount/`,
      data
    );
  }

  // DASHBOARD-Table2 APIs*********************************************************************************
  meterDataDSHB2() {
    return this.http.get(
      `${environment.serverNewUrl}/DailyLoad/getTodayValidationReport`
    );
  }

  // DASHBOARD-Table3 APIs Monthly-Mixed*************************************************************************************************

  mixedMonthlyData() {
    return this.http.get(
      `${environment.serverNewUrl}/DailyLoad/getMonthlyBillMixedValidationReport`
    );
  }

  // DASHBOARD-Table3 APIs Daily-Mixed*************************************************************************************************

  mixedDailyData() {
    return this.http.get(
      `${environment.serverNewUrl}/DailyLoad/getDLPEngMixedReport`
    );
  }
  // DownLOad Log Daily***************************************************************************************************

  singlePHDailyData(params: {[k:string]: string | number}) {
    return this.http.get(
      `${environment.serverNewUrl}/DailyLoad/GetDailyLoadProcessFailedLog`, { params }
    );
  }

  // MixedPHDailyData() {
  //   return this.http.get(
  //     `${environment.serverNewUrl}/DailyLoad/GetDailyLoadProcessFailedLog?dailyLoadOutPutID=45&meterType=Single phase`
  //   );
  // }

  // DownLOad Log Monthly****************************************
  singlePHMonthlyData(a: any) {
    return this.http.get(
      `${environment.serverNewUrl}/Validation/MonthlyBillLogData`,
      { params: a }
    );
  }

  // MixedPHMonthlyData(a: any) {
  //   return this.http.get(
  //     `${environment.serverNewUrl}/Validation/MonthlyBillMixedLogData`,
  //     { params: a }
  //   );
  // }
// New Monthly failed API***********************************************************

MixedPHMonthlyData(params: {[k:string]: string | number}) {
  return this.http.get(
    `${environment.serverNewUrl}/Validation/GetMontlyValidationReportFailedLog`,
    { params }
  );
}
  // Estimation Rule***********************************************************************************
  createEstimation(est: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/CreateEstimationRule`,
      est
    );
  }

  getEstimationList() {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/getEstimationRule`
    );
  }

  // deleteESTRecord(deleteData: any) {
  //   return this.http.post(
  //     `${environment.demoUrlCreateGetForTesting}/Estimation/DeleteEstimationRule` +
  //       deleteData.id,
  //     deleteData
  //   );
  // }

  deleteESTRecord(deleteData: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/DeleteEstimationRule?id=` +
        deleteData?.id,
      {}
    );
  }

  EditESTRecord(selectData: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/UpdateEstimationRule`,
      selectData
    );
  }

  // MonthlyESTimation
  addMonthlyESTLoadData() {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/GetEstimationMonthlyReport`
    );
  }

  MonthlyESTMixAvgReport(rule: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/MonthlyAverageRuleMixed?vruleId=` +
        rule?.vruleId,
      {}
    );
  }
  MonthlyESTSPAvgReport(rule: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/MonthlyAverageRuleSinglePhase?vruleId=` +
        rule?.vruleId,
      {}
    );
  }

  // MonthlyEstFailed
  MonthlyESTFailedReport(rule: any) {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/GetEstimationMonthlyFailedReport?ReportId=` +
        rule?.ReportId
    );
  }

  // MonthlyEstPassed
  MonthlyESTPassedReport(rule: any) {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/GetEstimationMonthlyPassedReport?ReportId=` +
        rule?.ReportId
    );
  }

  // Daily Estimation**********************
  addDailyESTLoadData() {
    return this.http.get(
    //  `${environment.serverNewUrl}/Estimation/GetEstimationDLPReport`
      `${environment.serverNewUrl}/Estimation/GetEstimationSummary`
    );
  }

  DailyESTMixAvgReport(rule: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/DLPAverageMixedRule?vruleId=` +
        rule?.vruleId,
      {}
    );
  }
  DailyESTSPAvgReport(rule: any) {
    return this.http.post(
      `${environment.serverNewUrl}/Estimation/DLPAverageRuleSinglePhase?vruleId=` +
        rule?.vruleId,
      {}
    );
  }

  // DailyEstPassed
  DailyESTFailedReport(rule: any) {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/GetEstimationDLPFailedReport?ReportId=` +
        rule?.ReportId
    );
  }

  // DailyEstFailed
  DailyESTPassedReport(rule: any) {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/GetEstimationDLPPassedReport?ReportId=` +
    //  `${environment.serverNewUrl}/Estimation/GetEstimationDLPPassedReport?ReportId=` +
        rule?.ReportId
    );
  }
  // DailyEstFailed
  RunEstimation(rule: any) {
   return this.http.post(
      `${environment.serverNewUrl}/Estimation/RunEstimation`,
      {},
      { params: rule }
    );
   /*  return this.http.get(
      `${environment.serverNewUrl}/Estimation/RunEstimation?vruleId=` +
        rule?.vruleId+`&dataType=`+rule?.dataType+`&dateParam=`+rule?.dateParam
    ); */
  }

  // Estimation Dashboard Report for Table2
  ESTDashbord() {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/GetEstimationDashboardReport`
    );
  }
  // Estimation Dashboard Report for Table2 Monthly
  ESTDashbordMonthlyReport() {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/getEstimationDashboardMonthlyReport`
    );
  }
  // Estimation Dashboard Report for Table2 Daily
  ESTDashbordDailyReport() {
    return this.http.get(
      `${environment.serverNewUrl}/Estimation/getEstimationDashboardDLPReport`
    );
  }
}
