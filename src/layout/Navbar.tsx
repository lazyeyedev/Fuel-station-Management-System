import { Bell, Search, UserCircle } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2">
        <Search size={16} className="text-text-secondary" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg text-text-secondary transition-colors hover:text-text-primary"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-1.5">
          <UserCircle size={22} className="text-primary" />
          <span className="text-sm font-medium text-text-primary">
            Admin
          </span>
        </div>
      </div>
    </header>
  )
}