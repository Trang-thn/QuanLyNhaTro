export interface DashboardRoomStat {
  status: string | null;
  count: number;
}

export interface DashboardRevenuePoint {
  month: string;
  revenue: string;
}

export interface DashboardOverview {
  totalRooms: number;
  roomStats: DashboardRoomStat[];
  occupancy: {
    occupiedRooms: number;
    rate: number;
  };
  totalDebt: string;
  revenueChart: DashboardRevenuePoint[];
}
