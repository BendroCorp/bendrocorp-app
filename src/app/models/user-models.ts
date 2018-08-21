import { Character } from './character-models'

export class UserSessionResponse
{
    id:number;
    character:Character;
    token:string;
    token_expires:number;
    claims:Claim[];
}

export class Claim
{
    id?:number;
    title?:string;
}

export class User 
{
    rsi_handle:string
}

export class SignUp 
{
    username?:string
    email?:string
    password?:string
    password_confirmation?:string
}

export class NewPassword
{
    old_password?:string
    password?:string
    password_confirmation?:string
}