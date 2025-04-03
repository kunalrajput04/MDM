import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Consumerlogdata, Consumerlogmodel } from 'src/app/Model/consumerlogmodel';
import { AuthService } from 'src/app/Service/auth.service';
import { DataService } from 'src/app/Service/data.service';
import { ChartOptions } from 'src/app/Shared/chartoptions';

@Component({
  selector: 'app-command-log-chart',
  templateUrl: './command-log-chart.component.html',
  styleUrls: ['./command-log-chart.component.css']
})
export class CommandLogChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;
  public chartOptions4: Partial<ChartOptions>;
  condumerlog: Consumerlogmodel = new Consumerlogmodel();
  constructor(
    private service: DataService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private authservice: AuthService
  ) {
    this.chartOptions = {
      pieseries: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
      },

      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };

    this.chartOptions1 = {
      pieseries: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',

        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#commsuccess').trigger('click');
            } else {
              $('#commfail').trigger('click');
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
    this.chartOptions2 = {
      pieseries: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#instsuccess').trigger('click');
            } else {
              $('#instfail').trigger('click');
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
    this.chartOptions3 = {
      pieseries: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#dlpdsuccess').trigger('click');
            } else {
              $('#dlpdfail').trigger('click');
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
    this.chartOptions4 = {
      pieseries: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#lpdsuccess').trigger('click');
            } else {
              $('#lpdfail').trigger('click');
            }
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
  }

  ngOnInit(): void {
    this.getInstant(null, null);

  }

  getInstant(from: any, to: any) {
    
    if (from == null && to == null) {
      from = new Date();
      to = new Date();
    }
    from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
    to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');

    this.service
      .getCommandLogChartData(from, to)
      .subscribe((res: any) => {
        
        this.condumerlog = res.data;

        if (this.condumerlog[0].instant == null)
          this.condumerlog[0].instant = new Consumerlogdata();
        if (this.condumerlog[0].dailyLP == null)
          this.condumerlog[0].dailyLP = new Consumerlogdata();
        if (this.condumerlog[0].deltaLP == null)
          this.condumerlog[0].deltaLP = new Consumerlogdata();
        if (this.condumerlog[0].billing == null)
          this.condumerlog[0].billing = new Consumerlogdata();

        if (this.condumerlog[0].otherRelatedEvents == null)
          this.condumerlog[0].otherRelatedEvents = new Consumerlogdata();

        if (this.condumerlog[0].powerRelatedEvents == null)
          this.condumerlog[0].powerRelatedEvents = new Consumerlogdata();

        if (this.condumerlog[0].voltageRelatedEvents == null)
          this.condumerlog[0].voltageRelatedEvents = new Consumerlogdata();

        if (this.condumerlog[0].currentRelatedEvents == null)
          this.condumerlog[0].currentRelatedEvents = new Consumerlogdata();

        if (this.condumerlog[0].controlRelatedEvents == null)
          this.condumerlog[0].controlRelatedEvents = new Consumerlogdata();

        if (this.condumerlog[0].transactionRelatedEvents == null)
          this.condumerlog[0].transactionRelatedEvents = new Consumerlogdata();

        this.chartOptions.pieseries = [this.condumerlog[0].instant.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].instant.IN_PROGRESS, this.condumerlog[0].instant.FAILURE == undefined ? 0 : this.condumerlog[0].instant.FAILURE, this.condumerlog[0].instant.SUCCESS == undefined ? 0 : this.condumerlog[0].instant.SUCCESS];

        this.chartOptions1.pieseries = [this.condumerlog[0].dailyLP.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].dailyLP.IN_PROGRESS, this.condumerlog[0].dailyLP.FAILURE == undefined ? 0 : this.condumerlog[0].dailyLP.FAILURE, this.condumerlog[0].dailyLP.SUCCESS == undefined ? 0 : this.condumerlog[0].dailyLP.SUCCESS];

        this.chartOptions2.pieseries = [this.condumerlog[0].deltaLP.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].deltaLP.IN_PROGRESS, this.condumerlog[0].deltaLP.FAILURE == undefined ? 0 : this.condumerlog[0].deltaLP.FAILURE, this.condumerlog[0].deltaLP.SUCCESS == undefined ? 0 : this.condumerlog[0].deltaLP.SUCCESS];

        this.chartOptions3.pieseries = [this.condumerlog[0].billing.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].billing.IN_PROGRESS, this.condumerlog[0].billing.FAILURE == undefined ? 0 : this.condumerlog[0].billing.FAILURE, this.condumerlog[0].billing.SUCCESS == undefined ? 0 : this.condumerlog[0].billing.SUCCESS];




        this.chartOptions4.pieseries = [
          (
            (this.condumerlog[0].otherRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].otherRelatedEvents.IN_PROGRESS)
            + (this.condumerlog[0].powerRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].powerRelatedEvents.IN_PROGRESS)
            + (this.condumerlog[0].voltageRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].voltageRelatedEvents.IN_PROGRESS)
            + (this.condumerlog[0].currentRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].currentRelatedEvents.IN_PROGRESS)
            + (this.condumerlog[0].controlRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].controlRelatedEvents.IN_PROGRESS)
            + (this.condumerlog[0].transactionRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].transactionRelatedEvents.IN_PROGRESS)
          )
          , (
            (this.condumerlog[0].otherRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].otherRelatedEvents.FAILURE)
            + (this.condumerlog[0].powerRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].powerRelatedEvents.FAILURE)
            + (this.condumerlog[0].voltageRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].voltageRelatedEvents.FAILURE)
            + (this.condumerlog[0].currentRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].currentRelatedEvents.FAILURE)
            + (this.condumerlog[0].controlRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].controlRelatedEvents.FAILURE)
            + (this.condumerlog[0].transactionRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].transactionRelatedEvents.FAILURE)
          )
          ,
          (
            (this.condumerlog[0].otherRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].otherRelatedEvents.SUCCESS)
            + (this.condumerlog[0].powerRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].powerRelatedEvents.SUCCESS)
            + (this.condumerlog[0].voltageRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].voltageRelatedEvents.SUCCESS)
            + (this.condumerlog[0].currentRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].currentRelatedEvents.SUCCESS)
            + (this.condumerlog[0].controlRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].controlRelatedEvents.SUCCESS)
            + (this.condumerlog[0].transactionRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].transactionRelatedEvents.SUCCESS)
          )];

      });
  }


}
