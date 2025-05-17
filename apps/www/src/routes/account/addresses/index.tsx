import { DashboardHeader } from '@lipy/web-ui/components/layouts/dashboard'
import EmptyPage from '@lipy/web-ui/components/pages/empty'
import { buttonVariants } from '@lipy/web-ui/components/ui/button'
import { cn } from '@lipy/web-ui/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MapPinHouse } from 'lucide-react'

export const Route = createFileRoute('/account/addresses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
     <>
      <DashboardHeader title="Addresses" />
      <EmptyPage icon={MapPinHouse} title='You have no saved addresses' label='Add a new address to get started'/>
      <div className='fixed bottom-0 w-full'>
  
        <Link className={cn(buttonVariants({ variant: 'default' }), 'm-4 w-full p-2 font-semibold')} to='/account/addresses/new'>Add New Address</Link>


      </div>
     
        

      
      
      
      </>
  )
}
