// src/types.ts

export interface BookingWithTimeline {
  id: string;
  service: string;
  customer_name: string;
  email: string;
  phone: string;
  created_at: string;       // or Date if you prefer
  tracking_id: string;
  timeline?: string[];      // optional, can be added later
}
