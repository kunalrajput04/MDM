import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceRequestComponent } from 'src/app/Views/MeterData/service-request/service-request.component';
import { AccessLevelServiceRequestComponent } from 'src/app/Views/Prepaid/ServiceRequest/access-level-service-request/access-level-service-request.component';
import { BusterComponent } from 'src/app/Views/Prepaid/Booster/buster/buster.component';
import { ConfigurationComponent } from 'src/app/Views/Prepaid/ConfigurationCommand/configuration/configuration.component';
import { ConsumerServiceRequestComponent } from 'src/app/Views/Prepaid/ServiceRequest/consumer-service-request/consumer-service-request.component';
import { ConsumerTypeServiceRequestComponent } from 'src/app/Views/Prepaid/ServiceRequest/consumer-type-service-request/consumer-type-service-request.component';
import { ExcelDataUploadComponent } from 'src/app/Views/Prepaid/excel-data-upload/excel-data-upload.component';
import { ExcelServiceRequestComponent } from 'src/app/Views/Prepaid/ServiceRequest/excel-service-request/excel-service-request.component';
import { PrepaidPostpaidComponent } from 'src/app/Views/Prepaid/prepaid-postpaid/prepaid-postpaid.component';
import { UpdateRequestComponent } from 'src/app/Views/Prepaid/update-request/update-request.component';
import { UpdateServiceRequestComponent } from 'src/app/Views/Prepaid/ServiceRequest/update-service-request/update-service-request.component';
import { TariffCategoryComponent } from 'src/app/Views/Prepaid/Tariff/tariff-category/tariff-category.component';
import { ConsumerTariffComponent } from 'src/app/Views/Prepaid/Tariff/consumer-tariff/consumer-tariff.component';
import { UpdateTariffComponent } from 'src/app/Views/Prepaid/Tariff/update-tariff/update-tariff.component';
import { AddTariffComponent } from 'src/app/Views/Prepaid/Tariff/add-tariff/add-tariff.component';
import { UpdateTariffRequestComponent } from 'src/app/Views/Prepaid/Tariff/update-tariff-request/update-tariff-request.component';
import { AddBoosterComponent } from 'src/app/Views/Prepaid/Booster/add-booster/add-booster.component';
import { UpdateBoosterComponent } from 'src/app/Views/Prepaid/Booster/update-booster/update-booster.component';
import { AddConfigComponent } from 'src/app/Views/Prepaid/ConfigurationCommand/add-config/add-config.component';
import { UpdateConfigComponent } from 'src/app/Views/Prepaid/ConfigurationCommand/update-config/update-config.component';
import { PrePayConfigComponent } from 'src/app/Views/Prepaid/pre-pay-config/pre-pay-config.component';
import { SanctionLoadComponent } from 'src/app/Views/Prepaid/Sanction/sanction-load/sanction-load.component';
import { AddSanctionComponent } from 'src/app/Views/Prepaid/Sanction/add-sanction/add-sanction.component';
import { OutageInformationComponent } from 'src/app/Views/Prepaid/outage-information/outage-information.component';
import { ListsComponent } from 'src/app/Views/Prepaid/ConsumerUpdateRequests/lists/lists.component';
import { CreteRequestComponent } from 'src/app/Views/Prepaid/ConsumerUpdateRequests/crete-request/crete-request.component';
import { UpdateRequestsComponent } from 'src/app/Views/Prepaid/ConsumerUpdateRequests/update-requests/update-requests.component';
import { FirmwareUpdateComponent } from 'src/app/Views/Prepaid/firmware-update/firmware-update.component';

const routes: Routes = [
  {
    path: 'PrepaidPostpaid',
    pathMatch: 'full',
    component: PrepaidPostpaidComponent,
  },

  { path: '', pathMatch: 'full', component: ServiceRequestComponent },
  {
    path: 'consumerservice',
    pathMatch: 'full',
    component: ConsumerServiceRequestComponent,
  },
  {
    path: 'consumertypeservice',
    pathMatch: 'full',
    component: ConsumerTypeServiceRequestComponent,
  },
  {
    path: 'excelservice',
    pathMatch: 'full',
    component: ExcelServiceRequestComponent,
  },
  {
    path: 'levelservice',
    pathMatch: 'full',
    component: AccessLevelServiceRequestComponent,
  },
  {
    path: 'updateservicerequest/:id',
    pathMatch: 'full',
    component: UpdateServiceRequestComponent,
  },

  { path: 'tariff', pathMatch: 'full', component: TariffCategoryComponent },
  { path: 'addtariff', pathMatch: 'full', component: AddTariffComponent },
  {
    path: 'updatetariff/:id',
    pathMatch: 'full',
    component: UpdateTariffRequestComponent,
  },
  {
    path: 'dataUpload',
    pathMatch: 'full',
    component: ExcelDataUploadComponent,
  },

  { path: 'buster', pathMatch: 'full', component: BusterComponent },
  { path: 'addbooster', pathMatch: 'full', component: AddBoosterComponent },
  {
    path: 'updatebooster/:id',
    pathMatch: 'full',
    component: UpdateBoosterComponent,
  },
  { path: 'configuration', pathMatch: 'full', component: AddConfigComponent },
  {
    path: 'updateconfig/:id',
    pathMatch: 'full',
    component: UpdateConfigComponent,
  },

  { path: 'Request', pathMatch: 'full', component: UpdateRequestComponent },
  { path: 'prepayconfig', pathMatch: 'full', component: PrePayConfigComponent },
  { path: 'sanction', pathMatch: 'full', component: SanctionLoadComponent },
  { path: 'addsanction', pathMatch: 'full', component: AddSanctionComponent },
  {
    path: 'outageinfo',
    pathMatch: 'full',
    component: OutageInformationComponent,
  },

  { path: 'UpdateRequests', pathMatch: 'full', component: ListsComponent },
  { path: 'NewRequest', pathMatch: 'full', component: CreteRequestComponent },
  {
    path: 'UpdateCustomerRequest/:id',
    pathMatch: 'full',
    component: UpdateRequestsComponent,
  },
  { path: 'firmware', pathMatch: 'full', component: FirmwareUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepaidRoutingModule {}
