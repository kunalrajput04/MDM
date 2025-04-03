export class MeterData {
  fromdate: string = '';
  todate: string = '';
  meterNo: string = '';
}

export class MeterDatas {
  level_name: string = '';
  level_value: string = '';
  start_date: string = '';
  end_date: string = '';
}

export class LogDatas {
  levelName: string = '';
  levelValue: string = '';
  startDate: string = '';
  endDate: string = '';
  commandName: string = '';
}
export class RecentInstantData {
  levelName: string = '';
  levelValue: string = '';
  date: string = '';
}

export class DeviceData{
  levelName: string = '';
  levelValue: string = '';
}

export class ConsumerInformation{
  consumer_Name:string='';
  consumer_No:string='';             
}

export class MeterInfomation{
  meter_No:string='';
  Meter_Type:string='';
  Subdivision_Name:string='';
  Substation_Name:string='';
  Feeder_Name:string='';
  NIC_MSISDN_NO:string='';
  NIC_IPV6:string='';
  Latitude:string='';
  Longitude:string='';             
}


export class FilterData {
  fromdate: string='';
  todate: string='';
  meterNo: string='';
  accessLevel: string='';
  dataRange: string='';
  subdivisonName: string='';
  substationName: string='';
  feederName: string='';
  dtName: string='';
}