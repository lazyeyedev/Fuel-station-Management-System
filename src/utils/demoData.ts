import { useStationStore } from "../store/stationStore";
import { useDailyStore } from "../store/dailyStore";
import { useTankStore } from "../store/tankStore";

export function loadDemoData() {
  const station = useStationStore.getState();
  const daily = useDailyStore.getState();
  const tanks = useTankStore.getState();

  station.saveAssignments([
    { nozzle: "Pump 1 - Super", attendant: "Joseph" },
    { nozzle: "Pump 1 - Diesel", attendant: "Owusu" },
    { nozzle: "Pump 2 - Diesel", attendant: "Francis" },
    { nozzle: "Pump 3 - Super 1", attendant: "Francis" },
    { nozzle: "Pump 3 - Super 2", attendant: "Francis" },
    { nozzle: "Pump 3 - Diesel 1", attendant: "Jesus Lina" },
    { nozzle: "Pump 3 - Diesel 2", attendant: "Joseph" },
    { nozzle: "Pump 3 - Diesel 3", attendant: "Zainabu" },
    { nozzle: "Pump 3 - Diesel 4", attendant: "Comfort" },
    { nozzle: "Pump 4 - Super", attendant: "Francis" },
    { nozzle: "Pump 4 - Diesel", attendant: "Noah" },
  ]);

  daily.setDaily({
    superLitres: 1180,
    dieselLitres: 1680,
    totalLitres: 2860,
    totalSales: 34574,

    meterReadings: [
      {
        nozzle: "Pump 1 - Super",
        attendant: "Joseph",
        opening: 100000,
        closing: 100350,
        litres: 350,
        amount: 4375,
      },
      {
        nozzle: "Pump 1 - Diesel",
        attendant: "Owusu",
        opening: 80000,
        closing: 80250,
        litres: 250,
        amount: 2950,
      },
      {
        nozzle: "Pump 2 - Diesel",
        attendant: "Francis",
        opening: 90000,
        closing: 90280,
        litres: 280,
        amount: 3304,
      },
      {
        nozzle: "Pump 3 - Super 1",
        attendant: "Francis",
        opening: 120000,
        closing: 120320,
        litres: 320,
        amount: 4000,
      },
      {
        nozzle: "Pump 3 - Super 2",
        attendant: "Francis",
        opening: 95000,
        closing: 95210,
        litres: 210,
        amount: 2625,
      },
      {
        nozzle: "Pump 3 - Diesel 1",
        attendant: "Jesus Lina",
        opening: 87000,
        closing: 87240,
        litres: 240,
        amount: 2832,
      },
      {
        nozzle: "Pump 3 - Diesel 2",
        attendant: "Joseph",
        opening: 91000,
        closing: 91230,
        litres: 230,
        amount: 2714,
      },
      {
        nozzle: "Pump 3 - Diesel 3",
        attendant: "Zainabu",
        opening: 78000,
        closing: 78200,
        litres: 200,
        amount: 2360,
      },
      {
        nozzle: "Pump 3 - Diesel 4",
        attendant: "Comfort",
        opening: 76000,
        closing: 76260,
        litres: 260,
        amount: 3068,
      },
      {
        nozzle: "Pump 4 - Super",
        attendant: "Francis",
        opening: 110000,
        closing: 110300,
        litres: 300,
        amount: 3750,
      },
      {
        nozzle: "Pump 4 - Diesel",
        attendant: "Noah",
        opening: 85000,
        closing: 85220,
        litres: 220,
        amount: 2596,
      },
    ],
  });

  tanks.updateTank("tank-super", 32000);
  tanks.updateTank("tank-diesel1", 21000);
  tanks.updateTank("tank-diesel2", 14000);
}