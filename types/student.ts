export interface Student {
    _id: string;
    studentId?: string;
    name: string;
    class: string;
    section: string;
    gender: string;
    stream: string;
    parentName: string;
    parentContact: string;
    schoolId: string;
    schoolName: string;
    branch: string;
    city: string;
    district: string;
    region: string;
    pincode: string;
    paymentVerified: boolean;
}

export interface StudentsResponse {
    students: Student[];
    total: number;
    page: number;
    totalPages: number;
}