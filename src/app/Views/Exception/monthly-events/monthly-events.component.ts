import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { AuthService } from 'src/app/Service/auth.service';
import { ExceptionServiceService } from 'src/app/Service/exception-service.service';
import { ChartOptions, ChartOptionsForNonAxis } from 'src/app/Shared/chartoptions';

export interface EVentChart {
  eventType: string,
  eventCount: number
}
@Component({
  selector: 'app-monthly-events',
  templateUrl: './monthly-events.component.html',
  styleUrls: ['./monthly-events.component.css']
})
export class MonthlyEventsComponent implements OnInit {

  @ViewChild("chart1") chart: ChartComponent;
  public chartOptions: Partial<ChartOptionsForNonAxis>;

  @ViewChild("barchart") barchart: ChartComponent;
  public barchartOptions: Partial<ChartOptions>;

  eventData: EVentChart[] = [];
  series: any[] = [];
  lable: any[] = [];
  colors: any[] = [];
  constructor(private exeservice: ExceptionServiceService, private datePipe: DatePipe, private authservice: AuthService) {
  
    this.renderChart()
  }

  ngOnInit(): void {

    //this.chart.render()
    this.getEventCount();
  }

  getEventCount() {

    this.exeservice.getEventsForChart('Month').subscribe((res: any) => {
      if (res.success) {

        this.eventData = res.data;
        for (let i = 0; i < this.eventData.length; i++) {
          this.series.push(this.eventData[i].eventCount);
          this.lable.push(this.eventData[i].eventType);
          this.colors.push(['red', 'orange', 'yellow', 'green', 'blue', 'purple'][Math.random() * 6 | 0])
        }
        setTimeout(()=>{ 
          this.renderChart();
      }, 1000);
      }
    },
      (err) => {
      }
    );
  }
  renderChart() {
    this.chartOptions = {
      series: this.series,
      labels: this.lable,
      chart: {
        type: "polarArea",
        redrawOnParentResize: true
      },
      stroke: {
        colors: ["#fff"]
      },
      fill: {
        opacity: 0.8
      },
      responsive: [
        {
          options: {
            chart: {
              width: '100%',
              height: '100%' 
            }
          }
        }
      ]
    };
    this.barchartOptions = {
      series: [
        {
          data: this.series
        }
      ],
      chart: {
        type: "bar",
        redrawOnParentResize: true
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom"
          }
        }
      },
      responsive: [
        {
          options: {
            chart: {
              width: '100%',
              height: '100%' 
            }
          }
        }
      ],
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7"
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: this.lable
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Monthly Events",
        align: "center",
        floating: true
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return "";
            }
          }
        }
      }
    };
  }


}
