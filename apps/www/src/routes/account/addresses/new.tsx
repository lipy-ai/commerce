
import { DashboardHeader } from '@lipy/web-ui/components/layouts/dashboard'
import { createFileRoute } from '@tanstack/react-router'
import GoogleMapImage from '@lipy/web-ui/components/maps/googleMap'
import { apiClient } from '@lipy/lib/api'
export const Route = createFileRoute('/account/addresses/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>

     <DashboardHeader title='New address' />
    
     <GoogleMapImage/>
   
    
    </>
   
  )
}
