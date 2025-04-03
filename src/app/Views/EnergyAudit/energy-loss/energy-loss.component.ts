import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { DataService } from 'src/app/Service/data.service';
import { DTService } from 'src/app/Service/dt.service';
import { FeederService } from 'src/app/Service/feeder.service';
import { SubdivisionService } from 'src/app/Service/subdivision.service';
import { SubstationService } from 'src/app/Service/substation.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';


export interface IFilterData {
  fromdate: string;
  todate: string;
  meterNo: string;
  accessLevel: string;
  dataRange: string;
  subdivisonName: string;
  substationName: string;
  feederName: string;
  dtName: string;
}
@Component({
  selector: 'app-energy-loss',
  templateUrl: './energy-loss.component.html',
  styleUrls: ['./energy-loss.component.css']
})


export class EnergyLossComponent implements OnInit {

   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Energy',
    levelurl: '',
    menuname: 'Energy Loss',
    url: '/mdm/vee/',
  };
  
  formdata: IFilterData = {
    accessLevel: 'CONSUMER',
    dataRange: 'DAILY',
    fromdate: '',
    meterNo: '',
    todate: '',
    dtName: '',
    feederName: '',
    subdivisonName: '',
    substationName: '',
  };
  //#endregion

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  lables: any = [];
  deltalables: any = [];
  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  levelValue: string;
  levelName: string;

  constructor(
    private service: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,
    private subdivisionservice: SubdivisionService,
    private substation: SubstationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private toastr: ToastrService,
    private authservice: AuthService

  ) { 
    this.authservice.chagneHeaderNav(this.datas);

      this.chartOptions2 = {
        series: [
          {
            name: "KVAH",
            type: "column",
            data: [350, 450, 550,250,600]
          },
          {
            name: "KWH",
            type: "column",
            data: [300, 400, 500,400,750]
          },
          {
            name: "Loss",
            type: "line",
            data: [250, 300, 400,350,600, 400]
          },
        ],
        legend: {
          position:'right',
          offsetX: -40,
          offsetY: 30,
          markers: {
            radius: 0,
        },
        },
        colors:['#008ffb', '#33FF99', '#000000'],
        chart: {
          height: 350,
          type: "line",
          stacked: false,
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [0,1,]
        },
        stroke: {
          width: [1, 1]
        },
        labels: [
          "16 May 2001",
          "17 May 2001",
          "18 May 2001",
          "19 May 2001",
          "20 May 2001",
        ],
        xaxis: {
          type: "datetime",
          axisBorder:{
            show:true,
            color:"gray"
          },
          },
        yaxis: [
          {
            axisBorder: {
              show: true,
              color: "gray"
            },
           
          },
        ],
        title: {
          text: "Consumption",
          align:'right',
          offsetX: 10,
          offsetY: 310,
          style:{
            fontWeight:'5'
          }
        },
      };
     }
  

  ngOnInit(): void {
    this.linechart();
    this.detailed();
  }

  linechart(){
    this.chartOptions = {
      series: [
        {
          name: "Total",
          type: "column",
          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
        },
        {
          name: "Consumption",
          type: "area",
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
        },
        {
          name: "Loss",
          type: "line",
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },

      title: {
        text: "Energy Forecasting",
        align: "left"
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%"
        }
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: [
        "01/01/2003",
        "02/01/2003",
        "03/01/2003",
        "04/01/2003",
        "05/01/2003",
        "06/01/2003",
        "07/01/2003",
        "08/01/2003",
        "09/01/2003",
        "10/01/2003",
        "11/01/2003"
      ],
      markers: {
        size: 0
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        title: {
          text: "Energy"
        },
        min: 0
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          }
        }
      }
    };
   }

   public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  detailed(){
    this.chartOptions1 = {
      series: [
        {
          name: "Energy Forecasting",
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33]
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11]
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65]
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24]
            },
            {
              x: new Date(1538785800000),
              y: [6638.24, 6640, 6620, 6624.47]
            },
            {
              x: new Date(1538787600000),
              y: [6624.53, 6636.03, 6621.68, 6624.31]
            },
            {
              x: new Date(1538789400000),
              y: [6624.61, 6632.2, 6617, 6626.02]
            },
            {
              x: new Date(1538791200000),
              y: [6627, 6627.62, 6584.22, 6603.02]
            },
            {
              x: new Date(1538793000000),
              y: [6605, 6608.03, 6598.95, 6604.01]
            },
            {
              x: new Date(1538794800000),
              y: [6604.5, 6614.4, 6602.26, 6608.02]
            },
            {
              x: new Date(1538796600000),
              y: [6608.02, 6610.68, 6601.99, 6608.91]
            },
            {
              x: new Date(1538798400000),
              y: [6608.91, 6618.99, 6608.01, 6612]
            },
            {
              x: new Date(1538800200000),
              y: [6612, 6615.13, 6605.09, 6612]
            },
            {
              x: new Date(1538802000000),
              y: [6612, 6624.12, 6608.43, 6622.95]
            },
            {
              x: new Date(1538803800000),
              y: [6623.91, 6623.91, 6615, 6615.67]
            },
            {
              x: new Date(1538805600000),
              y: [6618.69, 6618.74, 6610, 6610.4]
            },
            {
              x: new Date(1538807400000),
              y: [6611, 6622.78, 6610.4, 6614.9]
            },
            {
              x: new Date(1538809200000),
              y: [6614.9, 6626.2, 6613.33, 6623.45]
            },
            {
              x: new Date(1538811000000),
              y: [6623.48, 6627, 6618.38, 6620.35]
            },
            {
              x: new Date(1538812800000),
              y: [6619.43, 6620.35, 6610.05, 6615.53]
            },
            {
              x: new Date(1538814600000),
              y: [6615.53, 6617.93, 6610, 6615.19]
            },
            {
              x: new Date(1538816400000),
              y: [6615.19, 6621.6, 6608.2, 6620]
            },
            {
              x: new Date(1538818200000),
              y: [6619.54, 6625.17, 6614.15, 6620]
            },
            {
              x: new Date(1538820000000),
              y: [6620.33, 6634.15, 6617.24, 6624.61]
            },
            {
              x: new Date(1538821800000),
              y: [6625.95, 6626, 6611.66, 6617.58]
            },
            {
              x: new Date(1538823600000),
              y: [6619, 6625.97, 6595.27, 6598.86]
            },
            {
              x: new Date(1538825400000),
              y: [6598.86, 6598.88, 6570, 6587.16]
            },
            {
              x: new Date(1538827200000),
              y: [6588.86, 6600, 6580, 6593.4]
            },
            {
              x: new Date(1538829000000),
              y: [6593.99, 6598.89, 6585, 6587.81]
            },
            {
              x: new Date(1538830800000),
              y: [6587.81, 6592.73, 6567.14, 6578]
            },
            {
              x: new Date(1538832600000),
              y: [6578.35, 6581.72, 6567.39, 6579]
            },
            {
              x: new Date(1538834400000),
              y: [6579.38, 6580.92, 6566.77, 6575.96]
            },
            {
              x: new Date(1538836200000),
              y: [6575.96, 6589, 6571.77, 6588.92]
            },
            {
              x: new Date(1538838000000),
              y: [6588.92, 6594, 6577.55, 6589.22]
            },
            {
              x: new Date(1538839800000),
              y: [6589.3, 6598.89, 6589.1, 6596.08]
            },
            {
              x: new Date(1538841600000),
              y: [6597.5, 6600, 6588.39, 6596.25]
            },
            {
              x: new Date(1538843400000),
              y: [6598.03, 6600, 6588.73, 6595.97]
            },
            {
              x: new Date(1538845200000),
              y: [6595.97, 6602.01, 6588.17, 6602]
            },
            {
              x: new Date(1538847000000),
              y: [6602, 6607, 6596.51, 6599.95]
            },
            {
              x: new Date(1538848800000),
              y: [6600.63, 6601.21, 6590.39, 6591.02]
            },
            {
              x: new Date(1538850600000),
              y: [6591.02, 6603.08, 6591, 6591]
            },
            {
              x: new Date(1538852400000),
              y: [6591, 6601.32, 6585, 6592]
            },
            {
              x: new Date(1538854200000),
              y: [6593.13, 6596.01, 6590, 6593.34]
            },
            {
              x: new Date(1538856000000),
              y: [6593.34, 6604.76, 6582.63, 6593.86]
            },
            {
              x: new Date(1538857800000),
              y: [6593.86, 6604.28, 6586.57, 6600.01]
            },
            {
              x: new Date(1538859600000),
              y: [6601.81, 6603.21, 6592.78, 6596.25]
            },
            {
              x: new Date(1538861400000),
              y: [6596.25, 6604.2, 6590, 6602.99]
            },
            {
              x: new Date(1538863200000),
              y: [6602.99, 6606, 6584.99, 6587.81]
            },
            {
              x: new Date(1538865000000),
              y: [6587.81, 6595, 6583.27, 6591.96]
            },
            {
              x: new Date(1538866800000),
              y: [6591.97, 6596.07, 6585, 6588.39]
            },
            {
              x: new Date(1538868600000),
              y: [6587.6, 6598.21, 6587.6, 6594.27]
            },
            {
              x: new Date(1538870400000),
              y: [6596.44, 6601, 6590, 6596.55]
            },
            {
              x: new Date(1538872200000),
              y: [6598.91, 6605, 6596.61, 6600.02]
            },
            {
              x: new Date(1538874000000),
              y: [6600.55, 6605, 6589.14, 6593.01]
            },
            {
              x: new Date(1538875800000),
              y: [6593.15, 6605, 6592, 6603.06]
            },
            {
              x: new Date(1538877600000),
              y: [6603.07, 6604.5, 6599.09, 6603.89]
            },
            {
              x: new Date(1538879400000),
              y: [6604.44, 6604.44, 6600, 6603.5]
            },
            {
              x: new Date(1538881200000),
              y: [6603.5, 6603.99, 6597.5, 6603.86]
            },
            {
              x: new Date(1538883000000),
              y: [6603.85, 6605, 6600, 6604.07]
            },
            {
              x: new Date(1538884800000),
              y: [6604.98, 6606, 6604.07, 6606]
            }
          ]
        }
      ],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        text: "Energy Forecasting",
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }



  getSubdivision() {
    

    this.subdivisionservice.getSubdivision().subscribe(
      (res: any) => {
       
          
          this.subdivisionDropDown = [];
          let obj = res.data[0];
          for (var item in obj) {
            this.subdivisionDropDown.push(obj[item][0]);
          }
          
       
      },
      (err) => {
        
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getSubstation(subdivision: string) {
    
    this.substation.getSubstationBySubdivision(subdivision).subscribe(
      (res: any) => {
        
        this.substatioDropDown = [];
      
          
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
      
      },
      (err) => {
        
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getFeeder(substation: string) {
    
    this.feederservice.getFeederBySubstation(substation).subscribe(
      (res: any) => {
        
        this.feederDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
      
      },
      (err) => {
        
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  getDT(feeder: string) {
    
    this.dtservice.getDTByFeeder(feeder).subscribe(
      (res: any) => {
        
        this.dtDropDown = [];
       
          
          let obj = res.data[0];
          for (var item in obj) {
            this.dtDropDown.push(obj[item][0]);
          }
       
      },
      (err) => {
        
        this.toastr.error('Oops! Something Went Wrong.');
      }
    );
  }
  accessLevelChange() {
    if (this.formdata.accessLevel != 'CONSUMER') {
      this.getSubdivision();
    }
  }
  onSubmit(a:any){}
}

