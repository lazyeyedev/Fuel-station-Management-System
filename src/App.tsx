import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import ShiftAssignment from "./pages/ShiftAssignment";
import DailyEntry from "./pages/DailyEntry";
import PaymentSummary from "./pages/PaymentSummary";
import CashExpenses from "./pages/CashExpenses";
import ShiftClosing from "./pages/ShiftClosing";
import Receipts from "./pages/Receipts";
import TankManagement from "./pages/TankManagement";
import Attendants from "./pages/Attendants";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import DeveloperTools from "./pages/DeveloperTools";
import CustomerAccounts from "./pages/CustomerAccounts";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/shift-assignment"
          element={<ShiftAssignment />}
        />

        <Route
          path="/daily-entry"
          element={<DailyEntry />}
        />

        <Route
          path="/payments"
          element={<PaymentSummary />}
        />

        <Route
          path="/cash-expenses"
          element={<CashExpenses />}
        />

        <Route
           path="/customer-accounts"
             element={<CustomerAccounts />}
          />

        <Route
          path="/shift-closing"
          element={<ShiftClosing />}
        />

        <Route
          path="/receipts"
          element={<Receipts />}
        />

        <Route
          path="/tank-management"
          element={<TankManagement />}
        />

        <Route
          path="/attendants"
          element={<Attendants />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/developer-tools"
          element={<DeveloperTools />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>
    </Routes>
  );
}