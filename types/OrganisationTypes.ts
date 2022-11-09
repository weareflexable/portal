
export type OrganistationReq = {
    name: string,
    emailId: string,
    address: string,
    phoneNumber: string,
    imageHash: string
}
export type orgFormData = {
    name: string,
    emailId: string,
    address: string,
    phoneNumber: string,
    imageFile: Array<any>
}

export type Org = {
    name: string,
    id: string,
    logoUrl: string
}