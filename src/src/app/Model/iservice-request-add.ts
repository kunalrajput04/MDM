export interface IServiceRequestAdd {
    requestID: number;
    requestType: string;
    consumerNumber: string;
    requestByName: string;
    requestReason: string;
    response: string;
    remarks: string;
    requestTo:string;
    requestStatus:string;
    accessLevel:string;
    accessValue:string;
}

export interface ITariffRequestAdd {
    requestID: number;
    requestType: string;
    requestValue: string;
    consumerNumber: string;
    requestByName: string;
    requestReason: string;
    response: string;
    remarks: string;
    requestTo:string;
    requestStatus:string;
    sectionLoad:string;
    accessLevel:string;
    accessValue:string;
    oldTariff:string,
    newTariff:string
    meterType:string,
    supplyCategory:string,
    billingCategory:string,
    monthlyRental:number,
    tarrifRate1:number,
    tarrifRate2:number,
    tarrifRate3:number,
    gstRate:number,
    lowBalance:number,
    tarrifName :string
    tarrifStart :string      
}



export interface UploadAtAccessLevel{
    accessLevel: string,
    subdivisonName: string,
    substationName: string,
    feederName: string,
    dtName: string

}
