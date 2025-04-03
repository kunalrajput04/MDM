import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { HeaderMenu } from 'src/app/Model/header-menu';
import { AuthService } from 'src/app/Service/auth.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-prepaid-stats',
  templateUrl: './prepaid-stats.component.html',
  styleUrls: ['./prepaid-stats.component.css']
})
export class PrepaidStatsComponent implements OnInit {

   //#region  menu
   datas: HeaderMenu = {
    firstlevel: 'Revenue',
    levelurl: '',
    menuname: 'Revenue Stats',
    url: '/mdm/revenue/',
  };

  //#endregion


  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private authservice: AuthService
  ) { 

    this.authservice.chagneHeaderNav(this.datas);
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
  }

  ngOnInit(): void {
  }

}
