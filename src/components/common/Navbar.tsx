// Top navigation bar for switching between board and calendar views.
import { Search, ChevronDown, LayoutGrid } from 'lucide-react'

interface NavbarProps {
  viewMode: 'board' | 'calendar'
  onChangeView: (view: 'board' | 'calendar') => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function Navbar({ viewMode, onChangeView, searchQuery, onSearchChange }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-none items-center justify-between px-8 py-3">
        <div className="flex items-center gap-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-sm">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Memovo</span>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onChangeView('board')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'board'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Board
            </button>

            <button
              onClick={() => onChangeView('calendar')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'calendar'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Calendar
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search UI only */}
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e)=>onSearchChange(e.target.value)}
              className="w-72 rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400"
            />
          </div>

          {/* Guest workspace placeholder */}
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
              G
            </div>
            <span>Guest Workspace</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  )
}