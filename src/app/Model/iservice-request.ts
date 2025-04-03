export interface IServiceRequest {
  requestID: number;
  requestNumber: string;
  requestType: string;
  requestValue: string;
  consumerNumber: string;
  responseBy: string;
  requestReason: string;
  response: string;
  remarks: string;
  requestStatus: string;
  requestDate: string;
  requestBy: string;
  responseDate: string;
  createdby: number;
  meterType: string;
  supplyCategory: string;
  billingCategory: string;
  monthlyRental: number;
  tarrifRate1: number;
  tarrifRate2: number;
  tarrifRate3: number;
  gstRate: number;
  lowBalance: number;
  tarrifName :string, 
  tarrifStart:Date
}
export interface ITariffRequest {
  requestID: number;
  requestNumber: string;
  requestType: string;
  consumerNumber: string;
  responseBy: string;
  requestReason: string;
  response: string;
  remarks: string;
  requestStatus: string;
  requestDate: string;
  requestBy: string;
  responseDate: string;
  createdby: number;
}

export interface ConsumerUpdateRequest{
  requestID:number,
  requestNumber:string,
  requestStatus:string,
  consumerNo:string,
  requestReason:string,
  response:string,
  assignTo:number,
  changeTo:string,
  netMetering:string,
  billingTarrif:number,
  pendingAmount:number,
  arial:string,
  remarks:string,
  autoDisconnect:boolean,
  updated:Date
}
