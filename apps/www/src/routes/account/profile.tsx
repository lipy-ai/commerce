import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeader } from '@lipy/web-ui/components/layouts/dashboard'
import EmptyPage from '@lipy/web-ui/components/pages/empty'

export const Route = createFileRoute('/account/profile')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
      <DashboardHeader title="Profile" />
      <EmptyPage/>
      
      </>
    )
}
