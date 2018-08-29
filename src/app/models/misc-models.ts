export class LogItem
{
    module?:string;
    severity?:string; 
    message?:string;
    trace?:string;
}

export class MenuItem
{
    id?:string;
    title?:string;
    icon?:string;
    link?:string;
    internal?:boolean;
    nested_under_id?:number;
    ordinal?:number;
    nested_items?:MenuItem[];
}

export class StatusMessage
{
    message?:string;
}

export class Base64Upload
{
    temp_id?:number;
    name: string
    type: string 
    size: number
    base64: string
}