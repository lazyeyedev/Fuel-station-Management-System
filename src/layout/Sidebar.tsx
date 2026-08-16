import { NavLink } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { navItems } from '../routes/navItems'

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Droplet size={20} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-text-primary">SHELL</p>
          <p className="text-xs leading-none text-text-secondary mt-1">Station Manager</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
              ].join(' ')
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-6">
        <div className="rounded-xl border border-border bg-bg px-4 py-3">
          <p className="text-xs text-text-secondary">Version</p>
          <p className="text-sm font-medium text-text-primary">1.0.0</p>
        </div>
      </div>
    </aside>
  )
}
