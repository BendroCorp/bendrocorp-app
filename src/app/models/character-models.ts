export class Character {
    id?:number;
    first_name?:string;
    last_name?:string;
    full_name?:string;
    avatar_url?:string;
    current_job_level?: number
    current_job:Job
}

export class Job {
    id?: number
    title?: string
    description?: string
    recruit_job_id?: number
    next_job_id?: number
    division_id?: number
    hiring?: boolean
    job_level_id?: number
}

export class Division {
    id?: number
    name?: string
    color?: string
    short_name?: string
    description?: string
    can_have_ships?: boolean
    ordinal?: number

    division_members:Character[]
}