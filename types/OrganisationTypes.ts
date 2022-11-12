
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

export type Org = {
    name: string,
    id: string,
    logoUrl: string,
    role: string
}