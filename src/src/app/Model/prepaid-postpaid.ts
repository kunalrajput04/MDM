export interface PrepaidPostpaid {
    customerName:string,
    customerNo:string,
    whatsappNo:string,
    meterSerialNumber:string,
    simImei:string,
    iPv6Address:string,
    meterSealNo:string,
    boxSealNo:string,
    gprsSealNo:string,
    meterManufacture:string,
    consumerType:string
}

export interface ConsumerCount{
    prepaid:number,
    postpaid:number,
    total:number,
    date:Date,
    postpaidSingle :number,
    postpaidThree :number,
    postpaidLT :number,
    postpaidHT :number,
    prepaidSingle :number,
    prepaidThree 
}