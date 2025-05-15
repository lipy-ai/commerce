import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeader } from '@web-ui/components/layouts/dashboard'
import EmptyPage from '@web-ui/components/pages/empty'

export const Route = createFileRoute('/shop/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <DashboardHeader title={'Grihasthi Kirana'}/>
    <EmptyPage/>
    
    </>
  )
}
