import { useMemo, useState } from "react";

export default function Receipts() {
  const today = new Date().toISOString().split("T")[0];

  const [supplier, setSupplier] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [date, setDate] = useState(today);

  const [fuelType, setFuelType] = useState("Super");

  const [tank, setTank] = useState("Super Tank");

  const [litres, setLitres] = useState("");

  const [price, setPrice] = useState("");

  const total = useMemo(() => {
    return (
      Number(litres || 0) *
      Number(price || 0)
    );
  }, [litres, price]);

  function saveReceipt() {

    if (!supplier.trim()) {
      alert("Enter supplier name.");
      return;
    }

    if (!receiptNo.trim()) {
      alert("Enter receipt number.");
      return;
    }

    if (!litres.trim()) {
      alert("Enter litres received.");
      return;
    }

    if (!price.trim()) {
      alert("Enter cost per litre.");
      return;
    }

    alert("Receipt Saved Successfully");
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-white">
          Fuel Receipt
        </h1>

        <p className="text-gray-400">
          Record Fuel Received
        </p>

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="mb-2 block text-gray-400">
              Supplier
            </label>

            <input
              value={supplier}
              onChange={(e)=>setSupplier(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Receipt No.
            </label>

            <input
              value={receiptNo}
              onChange={(e)=>setReceiptNo(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Fuel Type
            </label>

            <select
              value={fuelType}
              onChange={(e)=>{
                setFuelType(e.target.value);

                if(e.target.value==="Super"){
                  setTank("Super Tank");
                }else{
                  setTank("Diesel Tank 1");
                }
              }}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Super</option>
              <option>Diesel</option>
            </select>

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Tank
            </label>

            <select
              value={tank}
              onChange={(e)=>setTank(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Super Tank</option>
              <option>Diesel Tank 1</option>
              <option>Diesel Tank 2</option>
            </select>

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Litres Received
            </label>

            <input
              type="number"
              value={litres}
              onChange={(e)=>setLitres(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Cost Per Litre
            </label>

            <input
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Total Cost
            </label>

            <input
              readOnly
              value={`GH₵ ${total.toLocaleString(undefined,{
                minimumFractionDigits:2,
                maximumFractionDigits:2,
              })}`}
              className="w-full rounded-xl bg-[#0E1116] p-3 font-bold text-green-400"
            />

          </div>

        </div>

      </div>

      <div className="flex justify-end">

        <button
          onClick={saveReceipt}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500"
        >
          Save Receipt
        </button>

      </div>

    </div>
  );
}