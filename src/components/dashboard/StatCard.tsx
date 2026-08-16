import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import GlassPanel from './GlassPanel'
import type { StatCardData } from '../../data/dashboardMockData'

interface StatCardProps {
  data: StatCardData
  icon: LucideIcon
}

export default function StatCard({ data, icon: Icon }: StatCardProps) {
  const isUp = data.trend === 'up'

  return (
    <GlassPanel className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{data.label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold text-text-primary">{data.value}</span>
            {data.unit && <span className="text-xs text-text-secondary">{data.unit}</span>}
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      <div
        className={[
          'mt-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium',
          isUp ? 'bg-primary/15 text-primary' : 'bg-rose-500/15 text-rose-400',
        ].join(' ')}
      >
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {data.delta}
        <span className="text-text-secondary font-normal">vs yesterday</span>
      </div>
    </GlassPanel>
  )
}
