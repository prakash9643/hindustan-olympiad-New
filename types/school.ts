export interface School {
    _id?: string;
    schoolId?: string;
    schoolName: string;
    branch: string;
    serialNumber: string;
    district: [string];
    region: string;
    board: string;
    city: string;
    pincode: string;
    principalName: string;
    principalPhone: string;
    principalEmail: string;
    coordinatorName: string;
    coordinatorPhone: string;
    coordinatorEmail: string;
    studentsCount: number,
    paymentVerification: number,
    addedBy: string,
}
export interface SchoolsResponse {
    schools: School[];
    total: number;
    page: number;
    totalPages: number;
}