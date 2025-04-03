export interface PrepaidRecharge {
    id:number;
    consumerNo:string,
    meterSerialNo:string,
    transactionId:string,
    mode:string,
    amount:number,
    ischeque:boolean,
    chequeBank:string,
    chequeBranch:string,
    chequeDate:string,
    chequeNumber:string,
    chequePenality:number,
    isChequeBounce:boolean,
    created:Date,
    isActive:boolean
}

export interface DataFilter{
    from:Date,
    to:Date,
    
}

export class MyDataFilter{
    from:string='';
    to:string='';
    
}

