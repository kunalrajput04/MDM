export interface IPrepayConfig {
  prepayID:number;
  balanceUpdateTime:string;
  happyHourStart:string;
  happyHourEnd:string;
  balanceLimit:number;
  sun:boolean;
  mon:boolean;
  tue:boolean;
  wed:boolean;
  thur:boolean;
  fri:boolean;
  sat:boolean;
}

export interface ICustomHoliday{
    holidayName:string;
    holidayDate:string;
    holiDayID :number
    }
    