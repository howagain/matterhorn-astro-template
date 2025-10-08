export interface Coupon {
    id: string;
    title: string;
    services: string[];
    imageUrl?: string;
    scheduleAppointmentUrl: string;
}