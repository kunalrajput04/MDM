export interface IMenu {
    urlName: string;
    key:string;
    icon:string;
    child:IMenuChild[];
}
export interface IMenuChild{
    urlName: string;
    key:string;
    icon:string;
    child?:IMenuChild[];
}
