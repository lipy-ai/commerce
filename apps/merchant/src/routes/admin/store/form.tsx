import { env } from "@envClient";
import { adminStoreApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import type { STORE_TYPE } from "@lipy/server/db/schema";
import {
  FormButton,
  FormDropdown,
  FormInput,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  fillBaseAddress,
  geocode,
} from "@lipy/web-ui/components/maps/utils/helper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Form, FormLabel } from "@lipy/web-ui/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@lipy/web-ui/components/ui/radio-group";
import { useJsApiLoader } from "@react-google-maps/api";
import { createFileRoute } from "@tanstack/react-router";
import {
  format,
  getHours,
  getMinutes,
  parse,
  setHours,
  setMinutes,
} from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/store/form")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      view: search.view as "create" | "update" | undefined,
      store: search.store as string | undefined,
    };
  },
});

const opts = [
  {
    label: "Restaurant",
    value: "restaurant",
  },
  {
    label: "Cafe",
    value: "cafe",
  },
];

function timeToDecimal(timeStr: string): number {
  const time = parse(timeStr, "HH:mm", new Date());
  return getHours(time) + getMinutes(time) / 60;
}

function decimalToTime(decimal: number): string {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  const time = setMinutes(setHours(new Date(), hours), minutes);
  return format(time, "HH:mm");
}

function RouteComponent() {
  const { view } = Route.useSearch();

  const defaultValues = {
    name: "",
    type: "restaurant" as (typeof STORE_TYPE)[number],
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    openingHour: decimalToTime(0),
    closingHour: decimalToTime(0),
  };
  const form = useForm({
    defaultValues,
  });

  const createMutate = useAPIMutation(adminStoreApi.index, "$post", {
    onSuccess: () => {
      toast.success("Store added successfully");
    },
  });
  const [openingHrs, closingHrs] = form.watch(["openingHour", "closingHour"]);

  const openNum = timeToDecimal(openingHrs || "00:00");
  const closeNum = timeToDecimal(closingHrs || "00:00");
  const hrsVal =
    openNum === 0 && closeNum === 0
      ? "24hrs"
      : openNum === 9 && closeNum === 23
        ? "9-11"
        : "custom";

  const handleValChange = (v: string) => {
    let openV = 0;
    let closeV = 0;

    if (v === "24hrs") {
      openV = 0;
      closeV = 0;
    }

    if (v === "9-11") {
      openV = 9;
      closeV = 23;
    }

    if (v === "custom") {
      openV = openNum + 1;
      closeV = closeNum;
    }

    form.setValue("openingHour", decimalToTime(openV));
    form.setValue("closingHour", decimalToTime(closeV));
  };

  useJsApiLoader({
    googleMapsApiKey: env.GOOGLE_MAP_API_KEY,
    libraries: env.GOOGLE_MAP_LIBRARIES,
  });

  const geocoder = async (address: string) => {
    const { result } = await geocode(address);
    const returnedAddress = fillBaseAddress(result);

    return returnedAddress;
  };

  const onSubmit = async (data: typeof defaultValues) => {
    const geocodedAddress = await geocoder(
      `${data.address.line1}, ${data.address.line2}, ${data.address.city}, ${data.address.state}, ${data.address.postalCode}, ${data.address.country}`
    );

    const payload = {
      ...data,
      address: {
        ...data.address,
        lat: geocodedAddress.lat,
        lng: geocodedAddress.lng,
      },
    };
    console.log(payload);

    await createMutate.mutateAsync({ json: payload });
  };

  return (
    <div>
      <DashboardHeader
        title={view === "create" ? "Create Store" : "Update Store"}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-5xl p-8 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-4">
                <FormInput
                  name="name"
                  label="Outlet Name"
                  placeholder="e.g. Pizza Hut"
                  wrapperClassName="col-span-8"
                  required
                />
                <FormDropdown
                  name="type"
                  opts={opts}
                  label="Outlet Type"
                  wrapperClassName="col-span-4"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="e.g. abc@gmai.com"
                  required
                  type="email"
                />
                <FormInput
                  name="phone"
                  label="Phone"
                  placeholder="e.g. 1234567890"
                  type="tel"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <FormInput
                label="Building / Flat / Shop no. "
                name="address.line1"
                placeholder="e.g. Shop no. 1, Building no. 1, Flat no. 1"
                required
              />
              <FormInput
                label="Locality Area / Land mark"
                name="address.line2"
                placeholder="e.g. Near ABC, Opposite XYZ"
                required
              />
              <div className="grid md:grid-cols-2 md:gap-4">
                <FormInput label="City" name="address.city" required />
                <FormInput
                  label="Pin code"
                  name="address.postalCode"
                  placeholder="e.g. 123456"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 md:gap-4">
                <FormInput label="State" name="address.state" required />

                <FormInput label="Country" name="address.country" required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={hrsVal}
                onValueChange={handleValChange}
                required
              >
                <FormLabel className="text-muted-foreground py-2">
                  Store Timing
                </FormLabel>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="24hrs" id="r1" />
                  <FormLabel htmlFor="r1">24 hours</FormLabel>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="9-11" id="r2" />
                  <FormLabel htmlFor="r2">9 am to 11 pm</FormLabel>
                </div>
                <div className="flex items-top gap-3">
                  <RadioGroupItem value="custom" id="r3" />
                  <div className="flex items-center flex-wrap gap-6 w-full justify-between">
                    <FormLabel htmlFor="r3">Custom</FormLabel>
                    <div className="flex items-center gap-2 h-4 relative -top-1">
                      <FormInput
                        type="time"
                        name="openingHour"
                        placeholder="Opens At"
                        wrapperClassName="mb-0 w-fit"
                        className="h-6"
                        style={{ fontSize: "0.8rem" }}
                      />
                      To
                      <FormInput
                        type="time"
                        name="closingHour"
                        placeholder="Closes At"
                        wrapperClassName="mb-0 w-fit"
                        className="h-6"
                        style={{ fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <FormButton>Save</FormButton>
        </form>
      </Form>
    </div>
  );
}
