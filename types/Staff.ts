export type Staff = {
    id: string,
    email: string,
    role: string,
    name: string,
    userRoleName: string,
    createdAt:string,
}

export type StaffReqPayload = {
    orgServiceId: string,
    staffEmailId: string
}