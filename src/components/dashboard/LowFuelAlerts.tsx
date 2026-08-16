import { AlertTriangle } from 'lucide-react'
import GlassPanel from './GlassPanel'
import type { LowFuelAlert } from '../../data/dashboardMockData'

interface LowFuelAlertsProps {
  alerts: LowFuelAlert[]
}

const statusStyles: Record<LowFuelAlert['status'], { badge: string; label: string; icon: string }> = {
  critical: { badge: 'bg-rose-500/15 text-rose-400', label: 'Critical', icon: 'text-rose-400' },
  warning: { badge: 'bg-amber-500/15 text-amber-400', label: 'Warning', icon: 'text-amber-400' },
  low: { badge: 'bg-accent/15 text-accent', label: 'Low', icon: 'text-accent' },
}

export default function LowFuelAlerts({ alerts }: LowFuelAlertsProps) {
  return (
    <GlassPanel className="p-5">
      <h3 className="text-sm font-semibold text-text-primary">Low Fuel Alerts</h3>

      <div className="mt-4 flex flex-col gap-3">
        {alerts.map((alert) => {
          const style = statusStyles[alert.status]
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-bg/40 p-3"
            >
              <div className={`mt-0.5 ${style.icon}`}>
                <AlertTriangle size={18} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary">{alert.tank}</p>
                  <span className={`rounded-lg px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                    {style.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{alert.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </GlassPanel>
  )
}
