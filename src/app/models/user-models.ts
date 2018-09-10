import { Character } from './character-models'

export class UserSessionResponse
{
    id:number;
    character:Character;
    tfa_enabled:boolean;
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
    id?:number
    username?:string
    rsi_handle?:string
    main_character?:Character
    roles?:Role[]
}

export class Role extends Claim
{
    nested_roles?:Role[]
}

export class NestedRole
{
    role_nested?:Role
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
    original_password?:string
    password?:string
    password_confirmation?:string
}

export class TwoFactorDataObject
{
    qr_data_string?:string
    seed_value?:string
}

export class TwoFactorAuthObject
{
    password:string
    code:string
}