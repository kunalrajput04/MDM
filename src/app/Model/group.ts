export interface Group {
  userID: number;
  userName: string;
  password: string;
  fullName: string;
  email: string;
  roleType: string;
  imageUrl: string;
  userAddress: string;
  directorName: string;
  directorMobileNo: string;
  isconsumer: boolean;
  isWealth: boolean;
  isUser: boolean;
  isRevenue: boolean;
  isAssets: boolean;
  isMeter: boolean;
  isEnergy: boolean;
  isCustomer: boolean;
  isPrepaidService: boolean;
  isException: boolean;
  isPrepaid: boolean;
  isVee: boolean;
  isCommunication: boolean;
  accessLevel: string;
  subdivisonName: string;
  substationName: string;
  feederName: string;
  dtName: string;
  ownerName:string;
  createdDate:string;
  

}

export interface Member {
  userID: number;
  fullName: string;
}
