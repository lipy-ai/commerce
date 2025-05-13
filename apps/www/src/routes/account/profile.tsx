import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeader } from '@web-ui/components/layouts/dashboard'
import EmptyPage from '@web-ui/components/pages/empty'

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
