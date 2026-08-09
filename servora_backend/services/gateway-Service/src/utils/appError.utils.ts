import { error } from "node:console";

export class appError extends Error{
    statusCode:number
    constructor(message:string,statusCode:number){
       super(message),
       this.statusCode=statusCode
    }
}