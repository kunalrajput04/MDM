import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrepaidRoutingModule } from './prepaid-routing.module';
import { TariffCategoryComponent } from 'src/app/Views/Prepaid/Tariff/tariff-category/tariff-category.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BusterComponent } from 'src/app/Views/Prepaid/Booster/buster/buster.component';
import { PrepaidPostpaidComponent } from 'src/app/Views/Prepaid/prepaid-postpaid/prepaid-postpaid.component';
import { ConfigurationComponent } from 'src/app/Views/Prepaid/ConfigurationCommand/configuration/configuration.component';
import { UpdateRequestComponent } from 'src/app/Views/Prepaid/update-request/update-request.component';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServiceRequestComponent } from 'src/app/Views/MeterData/service-request/service-request.component';
import { ConsumerServiceRequestComponent } from '../../Views/Prepaid/ServiceRequest/consumer-service-request/consumer-service-request.component';
import { ConsumerTypeServiceRequestComponent } from '../../Views/Prepaid/ServiceRequest/consumer-type-service-request/consumer-type-service-request.component';
import { AccessLevelServiceRequestComponent } from '../../Views/Prepaid/ServiceRequest/access-level-service-request/access-level-service-request.component';
import { UpdateServiceRequestComponent } from '../../Views/Prepaid/ServiceRequest/update-service-request/update-service-request.component';
import { ExcelServiceRequestComponent } from '../../Views/Prepaid/ServiceRequest/excel-service-request/excel-service-request.component';
import { ConsumerTariffComponent } from 'src/app/Views/Prepaid/Tariff/consumer-tariff/consumer-tariff.component';
import { UpdateTariffComponent } from '../../Views/Prepaid/Tariff/update-tariff/update-tariff.component';
import { AddTariffComponent } from '../../Views/Prepaid/Tariff/add-tariff/add-tariff.component';
import { UpdateTariffRequestComponent } from '../../Views/Prepaid/Tariff/update-tariff-request/update-tariff-request.component';
import { AddBoosterComponent } from '../../Views/Prepaid/Booster/add-booster/add-booster.component';
import { UpdateBoosterComponent } from '../../Views/Prepaid/Booster/update-booster/update-booster.component';
import { AddConfigComponent } from '../../Views/Prepaid/ConfigurationCommand/add-config/add-config.component';
import { UpdateConfigComponent } from '../../Views/Prepaid/ConfigurationCommand/update-config/update-config.component';
import { PrePayConfigComponent } from '../../Views/Prepaid/pre-pay-config/pre-pay-config.component';
import { SanctionLoadComponent } from 'src/app/Views/Prepaid/Sanction/sanction-load/sanction-load.component';
import { AddSanctionComponent } from 'src/app/Views/Prepaid/Sanction/add-sanction/add-sanction.component';
import { OutageInformationComponent } from '../../Views/Prepaid/outage-information/outage-information.component';
import { CreteRequestComponent } from 'src/app/Views/Prepaid/ConsumerUpdateRequests/crete-request/crete-request.component';
import { UpdateRequestsComponent } from 'src/app/Views/Prepaid/ConsumerUpdateRequests/update-requests/update-requests.component';
import { ListsComponent } from 'src/app/Views/Prepaid/ConsumerUpdateRequests/lists/lists.component';
import { FirmwareUpdateComponent } from '../../Views/Prepaid/firmware-update/firmware-update.component';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [TariffCategoryComponent,
    BusterComponent,
    PrepaidPostpaidComponent,
    ConfigurationComponent,
    UpdateRequestComponent,
    ServiceRequestComponent,
    ConsumerServiceRequestComponent,
    ConsumerTypeServiceRequestComponent,
    AccessLevelServiceRequestComponent,
    UpdateServiceRequestComponent,
    ExcelServiceRequestComponent,
    ConsumerTariffComponent,
    UpdateTariffComponent,
    AddTariffComponent,
    UpdateTariffRequestComponent,
    AddBoosterComponent,
    UpdateBoosterComponent,
    AddConfigComponent,
    UpdateConfigComponent,
    PrePayConfigComponent,
    SanctionLoadComponent,
    AddSanctionComponent,
    OutageInformationComponent,
    CreteRequestComponent,
    UpdateRequestComponent,
    UpdateRequestsComponent,
    ListsComponent,
    FirmwareUpdateComponent,


    
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    PrepaidRoutingModule,
    NgSelectModule,
    AgGridModule.withComponents([]),
    

  ],
  
})
export class PrepaidModule { }
