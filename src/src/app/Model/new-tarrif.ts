export interface NewTarrif {
    newTarrifId:number,
    requestID:number,
    tarrifRate1:number,
    tarrifRate2:number,
    tarrifRate3:number,
    gstRate:number,
    lowBalance:number,
    
    tarrifStart:Date,
    monthlyRental:number,
}

export interface NewTarriflist {
    newTarrifId:number,
    requestID:number,
    tarrifRate1:number,
    tarrifRate2:number,
    tarrifRate3:number,
    gstRate:number,
    lowBalance:number,
    monthlyRental:number,    
    tarrifStart:Date,
    updated:Date,
    isActive:boolean,
    tarrifName:string
}

export interface TarrifDropdown {    
    requestID:number,    
    tarrifName:string,    
}


