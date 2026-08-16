export interface StatCardData {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  trend: "up" | "down";
}

export const statCards: StatCardData[] = [
  {
    id: "sales",
    label: "Today's Sales",
    value: "GHS 48,230",
    delta: "+12.4%",
    trend: "up",
  },
  {
    id: "dispensed",
    label: "Fuel Dispensed",
    value: "9,840",
    unit: "Litres",
    delta: "+6.1%",
    trend: "up",
  },
  {
    id: "transactions",
    label: "Transactions",
    value: "312",
    delta: "-2.3%",
    trend: "down",
  },
  {
    id: "profit",
    label: "Profit",
    value: "GHS 7,940",
    delta: "+9.8%",
    trend: "up",
  },
];

export interface Transaction {
  id: string;
  receiptNo: string;
  pump: string;
  fuelType: "Super" | "Diesel";
  litres: number;
  amount: string;
  time: string;
}

export const recentTransactions: Transaction[] = [
  {
    id: "t1",
    receiptNo: "RCT-10245",
    pump: "Pump 1",
    fuelType: "Super",
    litres: 32.5,
    amount: "GHS 422.50",
    time: "09:41 AM",
  },
  {
    id: "t2",
    receiptNo: "RCT-10246",
    pump: "Pump 3",
    fuelType: "Diesel",
    litres: 50,
    amount: "GHS 610.00",
    time: "09:47 AM",
  },
  {
    id: "t3",
    receiptNo: "RCT-10247",
    pump: "Pump 2",
    fuelType: "Super",
    litres: 20.2,
    amount: "GHS 282.80",
    time: "09:52 AM",
  },
  {
    id: "t4",
    receiptNo: "RCT-10248",
    pump: "Pump 4",
    fuelType: "Super",
    litres: 15,
    amount: "GHS 195.00",
    time: "10:03 AM",
  },
  {
    id: "t5",
    receiptNo: "RCT-10249",
    pump: "Pump 1",
    fuelType: "Diesel",
    litres: 40.8,
    amount: "GHS 497.76",
    time: "10:15 AM",
  },
];

export interface TankStatus {
  id: string;
  fuelType: string;
  currentLitres: number;
  capacityLitres: number;
}

export const tankStatus: TankStatus[] = [
  {
    id: "super",
    fuelType: "Super Tank",
    currentLitres: 32000,
    capacityLitres: 45000,
  },

  {
    id: "diesel1",
    fuelType: "Diesel Tank 1",
    currentLitres: 21000,
    capacityLitres: 45000,
  },

  {
    id: "diesel2",
    fuelType: "Diesel Tank 2",
    currentLitres: 14000,
    capacityLitres: 36000,
  },
];

export interface LowFuelAlert {
  id: string;
  tank: string;
  message: string;
  status: "critical" | "warning" | "low";
}

export const lowFuelAlerts: LowFuelAlert[] = [
  {
    id: "a1",
    tank: "Diesel Tank 2",
    message: "Refill immediately.",
    status: "critical",
  },
  {
    id: "a2",
    tank: "Diesel Tank 1",
    message: "Tank level entering warning range.",
    status: "warning",
  },
  {
    id: "a3",
    tank: "Super Tank",
    message: "Tank operating normally.",
    status: "low",
  },
];