export interface IRevenueResponse {
    subdivionName:string;
    substation:ISubstationData[];
}
export interface ISubstationData {
    substationName:string;
    feeder:IFeederData[];
}

export interface IFeederData {
    feederName:string;
    dtName:string[];
}


