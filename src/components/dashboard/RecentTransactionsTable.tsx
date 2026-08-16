import GlassPanel from './GlassPanel'
import type { Transaction } from '../../data/dashboardMockData'

interface RecentTransactionsTableProps {
  transactions: Transaction[]
}

const fuelBadgeStyles: Record<Transaction['fuelType'], string> = {
  Super: 'bg-primary/15 text-primary',
  Diesel: 'bg-amber-500/15 text-amber-400',
  Premium: 'bg-accent/15 text-accent',
}

export default function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Recent Transactions</h3>
        <span className="text-xs text-text-secondary">{transactions.length} records</span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-text-secondary">
              <th className="py-2.5 pr-4 font-medium">Receipt No</th>
              <th className="py-2.5 pr-4 font-medium">Pump</th>
              <th className="py-2.5 pr-4 font-medium">Fuel Type</th>
              <th className="py-2.5 pr-4 font-medium">Litres</th>
              <th className="py-2.5 pr-4 font-medium">Amount</th>
              <th className="py-2.5 pr-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-border/40 text-text-primary transition-colors last:border-0 hover:bg-white/5"
              >
                <td className="py-3 pr-4 font-mono text-xs text-text-secondary">{tx.receiptNo}</td>
                <td className="py-3 pr-4">{tx.pump}</td>
                <td className="py-3 pr-4">
                  <span className={`rounded-lg px-2 py-1 text-xs font-medium ${fuelBadgeStyles[tx.fuelType]}`}>
                    {tx.fuelType}
                  </span>
                </td>
                <td className="py-3 pr-4">{tx.litres.toFixed(1)} L</td>
                <td className="py-3 pr-4 font-medium">{tx.amount}</td>
                <td className="py-3 pr-4 text-text-secondary">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}
