export interface Complain {
    cId:number;
    referenceId:string;
    description:string;
    title:string;
    type:string;
    created:Date;
    isActive:boolean;
    assignId:number;
    consumerName:string

}

export interface ComplainInfo {
    cId:number;
    referenceId:string;
    description:string;
    title:string;
    type:string;
    created:Date;
    isActive:boolean;
    assign:string;
    assignId:number;
    nameInitial:string;
    status:string;
    consumerName:string;
    createdUserName:string;
    

}
