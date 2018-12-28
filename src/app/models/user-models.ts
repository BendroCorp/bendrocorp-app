import { Character } from './character-models'

export class UserSessionResponse
{
    id?:number;
    character?:Character;
    tfa_enabled?:boolean;
    token?:string;
    token_expires?:number;
    claims?:Claim[];
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
    name?: string
    description?: string
    nested_roles?: NestedRole[]
}

export class NestedRole
{
    id?: number
    role_id?: number
    role_nested_id?: number
    role_nested?: Role
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

export class TokenObject
{
    id: number
    user_id: number
    token: string
    expires: Date
    device: string
    created_at: Date
    is_expired: boolean
}