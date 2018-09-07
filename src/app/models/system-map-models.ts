export class StarSystem 
{
    id?:number
    title?:string
    planets?:Planet[]
    system_objects?:SystemObject[]
}

export class Planet
{
    id?:number
    title?:string
    moons?:Moon[]
    system_objects?:SystemObject[]
    locations?:SystemLocation[]
}

export class Moon
{
    id?:number
    title?:string
    system_objects?:SystemObject[]
    settlements?:Settlement[]
    locations?:SystemLocation[]
}

export class SystemObject
{
    id?:number
    title?:string
    locations?:SystemLocation[]
}

export class Settlement
{
    id?:number
    title?:string
}

export class SystemLocation
{
    id?:number
    title?:string
}