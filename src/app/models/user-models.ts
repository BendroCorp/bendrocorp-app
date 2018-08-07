import { Character } from './character-models'

export class UserSessionResponse
{
    id:number;
    main_character:Character;
    token:string;
    token_expires:number;
    claims:Claim[];
}

export class Claim
{
    id?:number;
    title?:string;
}