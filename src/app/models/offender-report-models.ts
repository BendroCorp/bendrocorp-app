import { User } from "./user-models";

export class Offender 
{
    id?:number
    offender_name?:string
    offender_handle?:string
    offender_handle_verified?:boolean
    offender_reports?:OffenderReport[]
    /**
     * Used to create a new offender report. Will not be otherwise populated
     */
    offender_attributes?:OffenderReport
}

export class OffenderReport
{
    id?:number
    description?:string
    report_approved?:boolean
    submitted_for_approval?:boolean
    created_by?:User
    violence_rating?:ViolenceRating
    occured_when?:Date
    occured_when_ms?:number
    full_location?:string
    offender?:Offender

    system_id?:string
    planet_id?:string
    moon_id?:string

    offender_report_approval_request?:OffenderReportApprovalRequest
}

export class ViolenceRating
{
    id?:number
    title?:string
    description?:string
}

export class OffenderReportApprovalRequest
{
    id?:number
}