import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";

export interface TimelineEvent {
  status: string;
  date: string;
  completed: boolean;
}

export interface BookingRow extends RowDataPacket {
  id: number;
  service: string;
  customer_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  tracking_id: string;
}

export interface BookingWithTimeline {
  id: number;
  service: string;
  customer_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  tracking_id: string;
  timeline: TimelineEvent[];
  status: string;
}

// Union type for query results
export type QueryResult<T = any> = T[] | ResultSetHeader | OkPacket;