
export type OrganistationReq = {
    name: string,
    emailId: string,
    address: string,
    phoneNumber: string,
    imageHash: string
}
export type OrgFormData = {
    name: string,
    emailId: string,
    address: string,
    phoneNumber: string,
    imageFile: Array<any>
}

export interface Org {
    name: string,
    id: string,
    imageHash: string,
    role: string,
    approved: boolean
}

export interface NewOrg{
    contact?:any,
    status: number,
    id: string,
    orgId?: string,
    name: string,
    email: string,
    phone: string,
    contactNumber?:string|undefined,
    street: string,
    city: string,
    country: string,
    zipCode: string,
    logoImageHash: string,
    coverImageHash: string,
    createdBy: string,
    createdAt: string,
    statusName: string,
    isBankConnected: boolean,
    updatedBy: string,
    updatedAt: string
}

export interface OrgPayload{
    name: string,
    email: string,
    phone: string,
    street: string,
    contactNumber: string,
    city: string,
    country: string,
    zipCode: string,
    logoImageHash: string,
    coverImageHash: string,
}

export interface ActiveOrgs extends NewOrg {
    isActive:boolean
}

