import { Character } from "./character-models";
import { debounceTime } from "../../../node_modules/rxjs/operators";
import { Observable } from "../../../node_modules/rxjs";

export class Event
{
    id?:number;
    name?:string;
    description?:string;
    // start_date?:Date;
    // end_date?:Date;
    start_date_ms?:number;
    end_date_ms?:number;
    show_on_dashboard?:boolean;
    weekly_recurrance?:boolean;
    event_type_id?:number;
    event_type:EventType
    attendences?:EventAttendence[]   
    briefing:EventBriefing
    debriefing:EventDebriefing
    published:boolean

    private _start_date:Date
    private _end_date:Date

    // get start_date(): Date {
	// 	return this._start_date
	// }
	// set start_date(value: Date) {     
    //     this._start_date = new Date(value)   
	// 	this.start_date_ms = this._start_date.getTime()
    // }
    
    // get end_date(): Date {
    //     // return this._end_date
	// 	return new Date(this.end_date_ms)
	// }
	// set end_date(value: Date) {
    //     this._start_date = new Date(value)  
	// 	this.end_date_ms = this._end_date.getTime()
    // }

    // private _startDate: number;
    // private _endDate: number;

    // getStartDate()
    // {
    //     this.display_start_date = new Date(this.start_date_ms)
    //     return this.display_start_date        
    // }

    // getEndDate()
    // {
    //     this.display_end_date = new Date(this.end_date_ms)
    //     return this.display_end_date      
    // }

    // get display_start_date(): Date {
	// 	return new Date(this.start_date_ms)
	// }
	// set display_start_date(value: Date) {        
	// 	this.start_date_ms = value.getTime()
    // }
    
    // get display_end_date(): Date {
	// 	return new Date(this.end_date_ms)
	// }
	// set display_end_date(value: Date) {
	// 	this.end_date_ms = value.getTime()
    // }

    constructor() {
        // console.log("event construct");
        
        // if (this.start_date_ms) {
        //     this.display_start_date = new Date(this.start_date_ms)
        // }
        // if (this.end_date_ms) {
        //     this.display_end_date = new Date(this.end_date_ms)
        // }
    }
}

export class EventAttendence
{
    id?:number
    event_id?: number
    user_id?: number
    character_id?: number
    character?:Character;
    attendence_type_id?: number
    certified?:boolean
}

export class EventBriefing
{
    id?:number
    communications_designee_id?: number
    communications_designee?:Character
    escort_leader_id?:number
    escort_leader?: Character
    operational_leader_id?:number
    operational_leader?:Character
    reporting_designee_id?: number;
    reporting_designee?:Character

    notes?:string;
    objective?:string;
    
    published?:boolean
    published_when?: Date
    
    starting_system_id?: number
    ending_system_id?:number
}

export class EventDebriefing
{
    id?:number
    text?:string
}

export class AttendenceType
{
    id?:number;
    title?:string;
}

export class EventType
{
    id?:number;
    title?:string;
    description?:string;
}