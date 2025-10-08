import type { Coupon } from "./types/coupon.types"

export const getCouponDetailsFromId = (couponId: string): Coupon => {
    return {
        id: couponId,
        title: "Free Car",
        services: ["Service 1", "Service 2"],
        imageUrl: "https://cloudflareimages.dealereprocess.com/resrc/images/dep_asset,c_limit,dpr_2.0,f_auto,fl_lossy,q_80,w_400/3648132-L2hvbWUvZGVhbGVycy9hc3NldHMvNjM5L2ltYWdlcy8zNjQ4MTMyLXNlcnZpY2Vjb3Vwb25ubm5vbGluay5qcGc=",
        scheduleAppointmentUrl: "https://www.gillespieford.com/service-appointment"
    }
}