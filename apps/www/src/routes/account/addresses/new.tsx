import SearchBar from '@/components/searchBar'
import { DashboardHeader } from '@lipy/web-ui/components/layouts/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/addresses/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>

     <DashboardHeader title='New address' />
     <div className='m-2'>

       <SearchBar placeholder='Search for address'/>



     </div>
   
    
    </>
   
  )
}
