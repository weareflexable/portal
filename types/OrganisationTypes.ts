
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
    status: number,
    id: string,
    name: string,
    email: string,
    phone: string,
    contactNumber?:string,
    street: string,
    city: string,
    country: string,
    zipCode: string,
    logoImageHash: string,
    coverImageHash: string,
    createdBy: string,
    createdAt: string,
    statusName: string,
    updatedBy: string,
    updatedAt: string
}

export interface OrgPayload{
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    country: string,
    zipCode: string,
    logoImageHash: string,
    coverImageHash: string,
}

export interface ActiveOrgs extends NewOrg {
    isActive:boolean
}

