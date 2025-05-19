import { SquarePen, StepForward, X } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Separator } from "../ui/separator";
import { z } from "zod";
import type { FormSchema } from "../forms/renderer";
import { authClient } from "@lipy/lib/providers/auth";
import FormRender from "../forms/renderer";
import { toast } from "sonner";
import { useAPIMutation } from "@lipy/lib/utils/queryClient";
import { apiClient } from "@lipy/lib/api";
import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function DetailedAddress({ fullAddress, label }: { fullAddress: any; label: 'Edit' | 'Add' }) {
  const { isMobile } = useViewport();
  const { data } = authClient.useSession();
let building = ''
if (label === 'Edit'){
  building = fullAddress.line1.split(",")[0]
}

  const navigate = useNavigate()

  const forms: FormSchema<any, any> = [
    {
      id: "general",
      size: "default",
      style: {
        submitBtn: {
          label: "Save address",
          pos: {
            horizontal: "right",
          },
          className: "w-84",
        },
        editBtn: {
          label: "Edit Information",
        },
        labelPos: "top",
      },
      schema: z.object({
        yourName: z.string(),
        phoneNumber: z.string().optional(),
        building: z.string(),
        tag: z.enum(["home", "work", "other"]),
      }),
      values: {
        yourName: fullAddress.name || data?.user?.name || "",
        phoneNumber: "",
        tag: fullAddress.tag || "home",
        building: building || ''
      },
      elements: [
        {
          name: "building",
          fieldType: "Input",
          placeholder: "",
          label: "Flat/House No / Building Name",
          required: true,
        },
        {
          fieldType: "RadioGroup",
          name: "tag",
          label: "Address type",
          options: [
            { label: "Home", value: "home" },
            { label: "Work", value: "work" },
            { label: "Other", value: "other" },
          ],
        },
        [
          {
            name: "yourName",
            fieldType: "Input",
            placeholder: "John",
            label: "Your name",
            required: true,
          },
          {
            name: "phoneNumber",
            fieldType: "Input",
            label: "Phone number (optional)",
            required: false,
          },
        ],
      ],
    },
  ];

  
    const mutation = useAPIMutation(apiClient.v1.address,"$post");
    
  
  

  const handleAddAddress = (values: any) => {
     toast.promise(
    
           mutation.mutateAsync({
          json: {
            name: values.yourName || fullAddress.name,
            country: fullAddress.country,
            tag: values.tag,
            line1: values.building + ", " +fullAddress.address,
            line2: "",
            city: fullAddress.city,
            state: fullAddress.state,
            postal_code: fullAddress.postal_code,
          },
        }),
        {
          success:()=>{
            navigate({ to: "/account/addresses" , replace: true })
            return ("Address saved successfully")
          },
          error: "Something went wrong",
          loading: "Saving your address",
        }
    
        )
  };


  const handleEditAddress =(values)=>{
    toast.promise(
      apiClient.v1.address[":id"].$patch({
        param: { id: fullAddress.id },
        json: {
          name: values.yourName || fullAddress.name,
          country: fullAddress.country,
          tag: values.tag,
          line1: values.building + ", " +fullAddress.line1.split(",").slice(1).join(","),
          line2: "",
          city: fullAddress.city,
          state: fullAddress.state,
          postal_code: fullAddress.postal_code,
        },
      }),
      {
        success:()=>{
          navigate({ to: "/account/addresses" , replace: true })
          return "Address saved successfully"
        },
        error: "Something went wrong",
        loading: "Saving your address",
      }
    )
  }

  return (
    <Drawer>
      <DrawerTrigger className={cn(isMobile && "w-full")}>
        {
          label ==='Add' ? (
               <Button className="font-semibold px-6 w-full">
          Confirm this address
          <StepForward className="ml-2 h-4 w-4" />
        </Button>
          ) : label ==='Edit' ? (
             <Avatar className="w-8 h-8">
                      <AvatarFallback>
                         <SquarePen className="size-4  flex-shrink-0 text-muted-foreground" />

                      </AvatarFallback>
                    </Avatar>
          ): (
            < ></>
          )
        }
       
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between px-2">
            <DrawerTitle className="font-semibold text-lg">Add address details</DrawerTitle>
             <DrawerDescription></DrawerDescription>
            <DrawerClose>
              <X className="h-5 w-5" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <Separator />

        <div className="p-4">
          <div className="text-sm rounded-md border p-2 bg-accent font-medium">
            {/* <p>{fullAddress.address}</p> */}

            {
              label === 'Edit' ? (
                <p>{fullAddress.line1.split(",").slice(1).join(",")}</p>
              ):
              label === 'Add' ? (
                <p>{fullAddress.address}</p>
              ):(<></>)
            }
            <div className="flex justify-end">
              
                {/* <DrawerClose>
                     <Button size="sm" variant="outline" className="ml-auto">
                Change
              </Button>

                </DrawerClose> */}
                {
                  label === 'Add' ? (
                    <DrawerClose>
                     <Button size="sm" variant="outline" className="ml-auto">
                Change
              </Button>

                </DrawerClose>
                  ): label === 'Edit' ? (
                    // <GoogleMapImage/>
                    <Link className={cn(buttonVariants({variant:'outline', size:'sm'}), 'ml-auto')} to ="/account/addresses/new" params={{addressId: fullAddress.id}}>Change</Link>
                  ):(
                    <></>
                  )
                  
                }
             
            </div>
          </div>

          <FormRender forms={forms} onSubmit={
            label==='Edit' ? handleEditAddress : handleAddAddress
          } />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
