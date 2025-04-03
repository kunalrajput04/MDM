import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { MeterData } from 'src/app/Model/meter-data';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { SmartMeterService } from 'src/app/Service/smart-meter.service';
import { VeeService } from 'src/app/Service/vee.service';
import { combineLatest } from 'rxjs';
const veeSampleData = [
  {
    profileType: 'MONTHLY',
    totalData: 60,
    meterType: [
      {
        label: 'Single Phase',
        validation: {
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        updatedAt: new Date(),
        totalData: 60,
      },
      {
        label: 'Three Phase',
        validation: {
          success: 60,
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: 60,
        updatedAt: new Date(),
      },
      {
        label: 'CT Meter',
        validation: {
          success: 60,
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: 60,
        updatedAt: new Date(),
      },
      {
        label: 'HT Meter',
        validation: {
          success: 60,
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: 60,
        updatedAt: new Date(),
      },
    ],
  },

  {
    profileType: 'DAILY',
    totalData: 60,
    meterType: [
      {
        label: 'Single Phase',
        validation: {
          success: '',
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: '',
        updatedAt: new Date(),
      },
      {
        label: 'Three Phase',
        validation: {
          success: 50,
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: 46,
        updatedAt: new Date(),
      },
      {
        label: 'CT Meter',
        validation: {
          success: 50,
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: 46,
        updatedAt: new Date(),
      },
      {
        label: 'HT Meter',
        validation: {
          success: 50,
          failed: 10,
          failedPer: 0.5,
          pending: 0,
        },
        estimationEdition: {
          eligible: 0,
          success: 0,
          failed: 0,
          failedPer: 0,
          pending: 0,
          edited: 0,
          edtfailed: 0,
          edtFailedPer: 0.0,
        },
        totalData: 46,
        updatedAt: new Date(),
      },
    ],
  },
];
@Component({
  selector: 'app-vee-admin-dashboard',
  templateUrl: './vee-admin-dashboard.component.html',
  styleUrls: ['./vee-admin-dashboard.component.css'],
})
export class VeeAdminDashboardComponent implements OnInit {
  TotalInsMeter: any;
  TotalInsMeter2: any;
  MonthlyDashboardMixed: any;
  MonthlyDashboardMixedTHP: any;
  MonthlyDashboardMixedCTP: any;
  DailyDashboardMixed: any;
  DailyDashboardMixedCTM: any;
  DailyDashboardMixedHTM: any;
  MonthlyDailyDashboardSP: any;
  DailyDashboardSP: any;
  // Estimation
  EstDashboardReport: any;
  ESTDashbordDailyReport: any;
  ESTDashbordMonthlyReport: any;
  ESTDashbordMonthlySuccesstDSHB: any;
  ESTDashbordMonthlyFailedtDSHB: any;
  veeSampleDataNew = veeSampleData;
  formdata: MeterData = new MeterData();
  groupbyTotalData: any;
  groupBySuccess: any;
  groupByFailed: any;
  groupByFailedPer: any;
  groupByPending: any;
  // success
  MeterDailyPending: any;
  MeterDailyPendingMixed: any;
  successSP: any;
  successMixed: any;
  successTotal: any;
  successPercentage: any;
  grandTotal: any;
  // Fail
  failSP: any;
  failMixed: any;
  failTotal: any;
  failPercentage: any;

  // ***************************
  groupByEligible: any;
  groupByESTSuccess: any;
  groupByESTFailed: any;
  groupByESTFailedPer: any;
  groupByESTPending: any;

  groupByESTFailed2: any;
  groupByESTFailed2Per: any;
  meterTypeCheck: any;
  constructor(
    private service: DataService,
    private datePipe: DatePipe,
    private authservice: AuthService,
    private storeservice: SmartMeterService,
    private veeSR: VeeService
  ) {}

  ngOnInit(): void {
    console.log(this.MeterDailyPending);

    let date = new Date();
    date.setDate(date.getDate() - 6);
    this.formdata.fromdate = this.datePipe.transform(date, 'DD-MMM-YYYY');
    // Add Total Data *************************************************//Total Data replace with APIs
    // this.groupbyTotalData = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.totalData,
    //   0
    // );

    // DASHBOARD-Table1******************************************
    this.veeSR.meterDataDSHB(DSHB).subscribe((res: any) => {
      console.log(res);
      this.TotalInsMeter = res.data[0];
    });
    // DASHBOARD-Table2******************************************
    //  this.veeSR.meterDataDSHB2().subscribe((res:any)=>{
    //   console.log(res)
    //   this.TotalInsMeter2=res;
    //   console.log(this.TotalInsMeter2)
    // });

    // DASHBOARD-Table3-MonthlyMixed******************************************
    this.veeSR.mixedMonthlyData().subscribe((res: any) => {
      console.log(res);
      this.MonthlyDashboardMixed = res;
    });

    // DASHBOARD-Table3-Monthly-SinglePhase & Daily Single-phase and Table2-daily validationDAta******************************************
    // this.veeSR.meterDataDSHB2().subscribe((res: any) => {
    //   console.log(res);
    //   this.MonthlyDailyDashboardSP = res;
    //   this.MeterDailyPending = this.MonthlyDailyDashboardSP?.dlpTotal;
    //   this.successSP = this.MonthlyDailyDashboardSP?.dlpSuccess;
    //   console.log(
    //     this.MonthlyDailyDashboardSP?.dlpTotal,
    //     this.MeterDailyPending,
    //     this.successSP
    //   );
    // });
    // console.log(this.MeterDailyPending);

    // DASHBOARD-Table3-Daily-Mixed******************************************
    // this.veeSR.mixedDailyData().subscribe((res: any) => {
    //   console.log(res);
    //   this.DailyDashboardMixed = res;
    //   this.MeterDailyPendingMixed = res.reduce((ac, ob) => {
    //     return ac + ob.dlpTotal;
    //   }, 0);
    //   this.successMixed = res.reduce((ac, ob) => {
    //     return ac + ob.dlpSuccess;
    //   }, 0);
    //   console.log(this.MeterDailyPendingMixed, this.successMixed);
    //   this.DailyDashboardMixed.map((res) => {
    //     let meterType: string = res.meterType;
    //     console.log(res, meterType);

    //     if (meterType && meterType != 'Single phase') {
    //       // sample_str.split(" ").join("")
    //       meterType = meterType.toLowerCase().split(' ').join(''); //sample_str.replace(" ","","g")
    //       console.log(meterType);
    //     }
    //   });
    // });
    // Used combineLatest

    combineLatest(
      this.veeSR.meterDataDSHB2(),
      this.veeSR.mixedDailyData()
    ).subscribe(([res1, res2]) => {
      console.log(res1, res2);
      this.MonthlyDailyDashboardSP = res1;
      this.MeterDailyPending = this.MonthlyDailyDashboardSP?.dlpTotal;
      this.successSP = this.MonthlyDailyDashboardSP?.dlpSuccess;
      this.failSP = this.MonthlyDailyDashboardSP?.dlpFail;
      console.log(
        this.MonthlyDailyDashboardSP?.dlpTotal,
        this.MeterDailyPending,
        this.successSP
      );
      this.DailyDashboardMixed = res2;
      this.MeterDailyPendingMixed = this.DailyDashboardMixed.reduce(
        (ac, ob) => {
          return ac + ob.dlpTotal;
        },
        0
      );
      this.successMixed = this.DailyDashboardMixed.reduce((ac, ob) => {
        return ac + ob.dlpSuccess;
      }, 0);

      this.failMixed = this.DailyDashboardMixed.reduce((ac, ob) => {
        return ac + ob.dlpFail;
      }, 0);
      console.log(this.MeterDailyPendingMixed, this.successMixed);
      // Try to calculate Success
      this.grandTotal = this.MeterDailyPending + this.MeterDailyPendingMixed;
      this.successTotal = this.successSP + this.successMixed;
      this.successPercentage = (this.successTotal / this.grandTotal) * 100;
      console.log(
        this.MeterDailyPending,
        this.successTotal,
        this.grandTotal,
        this.successPercentage
      );

      // Try to calculate Fail
      this.failTotal = this.failSP + this.failMixed;
      this.failPercentage = (this.failTotal / this.grandTotal) * 100;
      console.log(this.failTotal, this.failPercentage);
    });

    // DASHBOARD-Table3-Daily-SinglePhase******************************************
    //  this.veeSR.meterDataDSHB2().subscribe((res:any)=>{
    //   console.log(res);
    //   this.DailyDashboardSP = res;
    // });
    // why pending count not coming here
    // Estimation Report Table2
    this.veeSR.ESTDashbord().subscribe((res) => {
      console.log(res);
      this.EstDashboardReport = res;
    });
    // Estimation Report Daily Table3
    this.veeSR.ESTDashbordDailyReport().subscribe((res) => {
      console.log(res);
      this.ESTDashbordDailyReport = res;

      // this.ESTDashbordDailyReport.map((res)=>{
      //   let meterType: string = res.meterType;
      //   console.log(res,meterType)

      //   if(meterType && meterType != 'Single phase'){ // sample_str.split(" ").join("")
      //     meterType = meterType.toLowerCase().split(" ").join("");//sample_str.replace(" ","","g")
      //     console.log(meterType)
      //   }
      // })
    });
    // Estimation Report Monthly Table3
    this.veeSR.ESTDashbordMonthlyReport().subscribe((res) => {
      console.log(res, '390');
      this.ESTDashbordMonthlyReport = res;
      // Success
      if (Array.isArray(res)) {
        this.ESTDashbordMonthlySuccesstDSHB = res.reduce((ac: any, ob: any) => {
          return ac + ob.estimationSuccessPercentage;
        }, 0);
      }
        // Failed
        if (Array.isArray(res)) {
          this.ESTDashbordMonthlyFailedtDSHB = res.reduce((ac: any, ob: any) => {
            return ac + ob.estimationFailPercentage;
          }, 0);
      }

        console.log(
          this.ESTDashbordMonthlySuccesstDSHB,this.ESTDashbordMonthlyFailedtDSHB
        );
    });
    // ************************************************************************************
    this.groupByPending =
      Number(this.TotalInsMeter?.meters) -
      Number(this.MonthlyDailyDashboardSP?.dlpTotal);
    console.log(
      this.TotalInsMeter?.meters,
      this.groupByPending,
      this.MonthlyDailyDashboardSP?.dlpTotal
    );

    // **********************
    // this.groupBySuccess = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.validation.success,
    //   0
    // );
    // this.groupByFailed = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.validation.failed,
    //   0
    // );
    // this.groupByFailedPer = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.validation.failedPer,
    //   0
    // );
    // this.groupByPending = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.validation.pending,
    //   0
    // );
    // this.groupByEligible = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.eligible,
    //   0
    // );
    // this.groupByESTSuccess = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.success,
    //   0
    // );
    // this.groupByESTFailed = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.failed,
    //   0
    // );
    // this.groupByESTFailedPer = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.failedPer,
    //   0
    // );
    // this.groupByESTPending = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.pending,
    //   0
    // );
    // this.groupByESTFailed2 = this.veeSampleDataNew.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.edtfailed,
    //   0
    // );
    // this.groupByESTFailed2Per = this.veeSampleDataNew?.reduce(
    //   (pv, cv) => pv + cv.estimationEdition.edtFailedPer,
    //   0
    // );
  }

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'DD-MMM-YYYY'
    );

    // Create modified Json***********************************************************
  }
}

const DSHB = {
  levelValue: 'MPDCL',
  devType: 'All',
};
