export interface ConsumerMeterInfo {
  customerName: string;
  meterType: string;
  address: string;
  customerNo: string;
  whatsappNo: string;
  substationName: string;
  subdivisionName: string;
  feederName: string;
  dtName: string;
  meterSerialNumber: string;
  iPv6Address: string;
  latitude: string;
  longitude: string;
  aadharNo: string;
  newConsumerNo: string;
  billingCategory: string;
  simType: string;
  simImei: string;
  consumerType: string;
  currentBalance: string;
  lastRechargeDate: string;
  city: string;
  pincode: string;
  tariffName: string;
}

export interface LowBalanceMeters {
  customerName: string;
  customerNo: string;
  consumeUnitkwh: string;
  lastRecharge: number;
  currentBalance: number;
  lastRechargeDate: string;
  lastBalance: number;
  currentReading: string;
  lastReading: string;
  consumerTyp: string;
}
