import { useState } from "react";
import { useCustomerAccountStore } from "../store/customerAccountStore";
import ReceivePaymentModal from "../components/customers/ReceivePaymentModal";
import type { CustomerAccount } from "../store/customerAccountStore";
import { useCustomerPaymentStore } from "../store/customerPaymentStore";

export default function CustomerAccounts() {
  const accounts = useCustomerAccountStore((s) => s.accounts);
  const addAccount = useCustomerAccountStore((s) => s.addAccount);
  const totalOutstanding = useCustomerAccountStore(
  (s) => s.totalOutstanding
);

const receivePayment = useCustomerAccountStore(
  (s) => s.receivePayment
);

const addCustomerPayment =
  useCustomerPaymentStore(
    (s) => s.addPayment
  );

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [fuel, setFuel] = useState<"Super" | "Diesel">("Diesel");
  const [litres, setLitres] = useState("");
  const [amount, setAmount] = useState("");
  const [approvedBy, setApprovedBy] = useState("Manager");
  const [selectedAccount, setSelectedAccount] =
  useState<CustomerAccount | null>(null);

  function saveCreditSale() {
    if (!litres || !amount) {
      alert("Please enter litres and amount.");
      return;
    }

    addAccount({
      customer:
        customer.trim() || "Walk-in Credit Customer",
      phone,
      fuel,
      litres: Number(litres),
      amount: Number(amount),
      approvedBy,
    });

    setCustomer("");
    setPhone("");
    setFuel("Diesel");
    setLitres("");
    setAmount("");
    setApprovedBy("Manager");

    alert("Credit sale saved successfully.");
  }

  const money = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-white">
          Customer Accounts
        </h1>

        <p className="text-gray-400">
          Record customers who buy fuel on credit.
        </p>

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="mb-2 block text-gray-400">
              Customer Name (Optional)
            </label>

            <input
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Phone Number (Optional)
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Fuel Type
            </label>

            <select
              value={fuel}
              onChange={(e) =>
                setFuel(
                  e.target.value as
                    | "Super"
                    | "Diesel"
                )
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Super</option>
              <option>Diesel</option>
            </select>

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Litres
            </label>

            <input
              type="number"
              value={litres}
              onChange={(e) =>
                setLitres(e.target.value)
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Amount (GH₵)
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Approved By
            </label>

            <select
              value={approvedBy}
              onChange={(e) =>
                setApprovedBy(e.target.value)
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Manager</option>
              <option>Assistant Manager</option>
            </select>

          </div>

        </div>

      </div>

      <div className="flex justify-end">

        <button
          onClick={saveCreditSale}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500"
        >
          Save Credit Sale
        </button>

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-xl font-bold text-white">
            Customer Accounts
          </h2>

          <h2 className="font-bold text-green-400">
            Outstanding: GH₵{" "}
            {money(totalOutstanding())}
          </h2>

        </div>

        {accounts.length === 0 ? (

          <p className="text-gray-400">
            No customer accounts yet.
          </p>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-700 text-gray-400">

                <th className="py-3 text-left">
                  Date
                </th>

                <th className="text-left">
                  Customer
                </th>

                <th>Fuel</th>

                <th>Litres</th>

                <th>Amount</th>

                <th>Paid</th>

                <th>Balance</th>

                <th>Status</th>

                 <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {accounts.map((account) => {

                const balance =
                  account.amount -
                  account.paid;

                const status =
                  balance === 0
                    ? "Paid"
                    : account.paid > 0
                    ? "Partial"
                    : "Outstanding";

                return (

                  <tr
                    key={account.id}
                    className="border-b border-gray-800"
                  >

                    <td className="py-3">
                      {account.date}
                    </td>

                    <td>
                      {account.customer}
                    </td>

                    <td>
                      {account.fuel}
                    </td>

                    <td>
                      {account.litres}
                    </td>

                    <td>
                      GH₵ {money(account.amount)}
                    </td>

                    <td>
                      GH₵ {money(account.paid)}
                    </td>

                    <td className="font-bold text-yellow-400">
                      GH₵ {money(balance)}
                    </td>

                    <td
  className={`font-bold ${
    status === "Paid"
      ? "text-green-400"
      : status === "Partial"
      ? "text-yellow-400"
      : "text-red-500"
  }`}
>
  {status}
</td>

<td>

  {balance > 0 && (

    <button
      onClick={() => setSelectedAccount(account)}
      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500"
    >
      Receive Payment
    </button>

  )}

</td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

      </div>

      {selectedAccount && (

  <ReceivePaymentModal
    customer={selectedAccount.customer}
    outstanding={
      selectedAccount.amount -
      selectedAccount.paid
    }
    onClose={() =>
      setSelectedAccount(null)
    }
   onReceive={(amount, method) => {

  receivePayment(
    selectedAccount.id,
    amount
  );

  addCustomerPayment({
    customer: selectedAccount.customer,
    amount,
    method,
    receivedBy: "Manager",
  });

  setSelectedAccount(null);

  alert("Payment received successfully.");

}}
  />

)}

    </div>
  );
}