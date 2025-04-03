export interface PrepaidDailySummary {
    Id: number,
    meterSerialNo:string,    
    mdas:Date,
    readingDate:Date,    
    consumeUnitkwh: string,
    billAmount:number,
    lastBalance:number,
    currentBalance:number,
    lastRecharge:number,
    currentReading:number,    
    lastReading:string,
    remarks:string,
    commandCreated:Date,
    isCommandExecuted:boolean,
    isActive:boolean,
    created:Date
}


export interface PrepaidMonthlySummary {
    Id: number,
    meterSerialNo:string,    
    mdas:Date,
    readingDate:Date,    
    consumeUnitkwh: string,
    billAmount:number,
    lastBalance:number,
    currentBalance:number,
    lastRecharge:number,
    currentReading:number,    
    lastReading:string,
    remarks:string,
    commandCreated:Date,
    isCommandExecuted:boolean,
    isActive:boolean,
    created:Date
}
