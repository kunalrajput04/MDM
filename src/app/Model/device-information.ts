export class DeviceInformation {
  ownerName: string = '';
  subDivisionName: string = '';
  feederName: string = '';
  subStationName: string = '';
  dtName: string = '';
  commissioningStatus: string = '';
  consumerName: string = '';
  consumerNo: string = '';
  phoneNumber: string = '';
  latitude: string = '';
  longitude: string = '';
  deviceType: string = '';
  ipAddressMain: string = '';
  ipPortMain: string = '';
  address: string = '';
  manufacturer: string = '';
  deviceSerialNo: string = '';
  description: string = 'HES';
  meterType: string = '';
}

export class getDevice {
  deviceNo: string = '';
}

export class deleteDevice {
  deviceSerialNo: string = '';
  reason: string = '';
}

export interface DeviceInfoList {
  consumerName: string;
  deviceSerialNo: string;
  consumerNo: string;
  installationDate: string;
  meterType: string;
  meterMode: string;
  subDivisionName: string;
  feederName: string;
  dtName: string;
  subStationName: string;
  nicMsisdnNo: string;
  ipAddressMain: string;
  latitude: string;
  network: string;
  longitude: string;
}
