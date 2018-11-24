import { Base64Upload, IdTitleDesc } from "./misc-models";

export class StarSystem 
{
    id?:number
    title?:string
    planets?:Planet[]
    system_objects?:SystemObject[]
    jump_points?:JumpPoint[]
    gravity_wells?:GravityWell[]
}

export class GravityWell
{
    id?:number
    title?:string
    description?:string
    new_primary_image?:Base64Upload
    primary_image_url?:string
}

export class Planet
{
    id?:number
    title?:string
    moons?:Moon[]
    system_objects?:SystemObject[]
    locations?:SystemLocation[]
    orbits_system_id?:number
    new_primary_image?:Base64Upload
    primary_image_url?:string
}

export class Moon
{
    id?:number
    title?:string
    description?:string
    orbits_planet_id?:number
    orbits_planet?:Planet
    system_objects?:SystemObject[]
    settlements?:Settlement[]
    locations?:SystemLocation[]
    new_primary_image?:Base64Upload
    primary_image_url?:string
}

export class SystemObject
{
    id?:number
    title?:string
    description?:string
    orbits_system_id?:number
    orbits_planet_id?:number
    orbits_moon_id?:number
    locations?:SystemLocation[]
    new_primary_image?:Base64Upload
    primary_image_url?:string
    object_type_id?:number
    object_type?:IdTitleDesc
}

export class Settlement
{
    id?:number
    title?:string
    on_planet_id?:number
    on_moon_id?:number
    new_primary_image?:Base64Upload
    primary_image_url?:string
}

export class SystemLocation
{
    id?:number
    title?:string
    on_planet_id?:number
    on_moon_id?:number
    on_system_object_id?:number
    on_settlement_id?:number
    new_primary_image?:Base64Upload
    primary_image_url?:string
    location_type?: IdTitleDesc
    location_type_id?:number
}


export class JumpPoint
{
    id?:number
    title?:string
}

export class SystemMapTypes
{
    gravity_well_types?: IdTitleDesc[]
    planetary_body_types?: IdTitleDesc[]
    moon_types?: IdTitleDesc[]
    gw_lum_classes?: IdTitleDesc[]
    jp_sizes?: IdTitleDesc[]
    jp_statues?: IdTitleDesc[]
    system_object_types?: IdTitleDesc[]
    location_types?: IdTitleDesc[]
}
