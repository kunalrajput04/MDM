export interface Payment {
    cNo:string,
    Tid:string,
    amt:number,
    status:string,   
    
}

export interface PaymentViewModel {
    pid:number,
    cNo:string,   
    tid:string,
    amt:number,
    status:string,
    created:Date
   
}
