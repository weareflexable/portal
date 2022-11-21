
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
    logoUrl: string,
    role: string,
    approved: boolean
}

export interface ActiveOrgs extends Org {
    isActive:boolean
}

