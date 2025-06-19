import SettingsCard from '@lipy/web-ui/components/custom-ui/settingsCard'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Store, Users } from 'lucide-react'

export const Route = createFileRoute('/(loggedIn)/store')({
  component: RouteComponent,
})

const items = [
  {
    title: 'Store details',
    icon: Store,
    url: '/store'
  },
  {
    title : "Store staff",
    icon :Users,
    url: '/store/staff'
  }
]

function RouteComponent() {
  return (
    <div className="flex gap-6 min-h-screen">
      {/* Left Panel */}
      <div className="flex-shrink-0 w-80 sticky top-20 h-fit self-start">
        <SettingsCard items={items} title="" />
      </div>

      {/* Right Panel (Scrollable) */}
      <div
        className="flex-1 overflow-y-auto pr-2"
        style={{ maxHeight: 'calc(100vh - 5rem)', scrollbarWidth: 'none' }}
      >
        <Outlet />
      </div>
    </div>
  );
}
