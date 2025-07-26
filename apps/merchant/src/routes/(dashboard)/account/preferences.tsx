import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";

import { Card } from "@lipy/web-ui/components/ui/card";

import { FormButton, FormSwitch } from "@lipy/web-ui/components/forms/elements";
import {
  Form,
  FormDescription,
  FormLabel,
} from "@lipy/web-ui/components/ui/form";

import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { AccountNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/account/preferences")({
  component: RouteComponent,
});

const notification = {
  communication: {
    name: "Communication",
    desc: "Receive emails about your account activity.",
  },
  marketing: {
    name: "Marketing",
    desc: "Receive emails about your account activity.",
  },
  social: {
    name: "Social",
    desc: "Receive emails about your account activity.",
  },
  security: {
    name: "Security",
    desc: "Receive emails about your account activity.",
  },
};

function RouteComponent() {
  const onSubmit = async (body: any) => {
    console.log(body);
  };
  // const { isMobile } = useViewport();

  const form = useForm({
    // resolver: zodResolver(),
    defaultValues: {},
  });

  return (
    <>
      <DashboardHeader title="Preferences" />
      <AccountNav>
        <Card className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 p-4 max-w-4xl"
            >
              <div className="grid lg:gap-4">
                <div className="">
                  <h1 className="text-lg font-medium py-4 flex gap-2 items-center">
                    Notifications
                  </h1>
                  <div className="space-y-4">
                    {Object.keys(notification).map((k) => {
                      const v = notification[k as keyof typeof notification];
                      return (
                        <div
                          key={k}
                          className="flex items-center justify-between bg-accent/30 rounded border p-4"
                        >
                          <div className="space-y-1">
                            <FormLabel>{v.name}</FormLabel>
                            <FormDescription>{v.desc}</FormDescription>
                          </div>
                          <FormSwitch
                            name="refunds.enabled"
                            wrapperClassName="w-fit"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="py-4">
                    <FormButton className="" disabled={!form.formState.isDirty}>
                      Save Changes
                    </FormButton>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </AccountNav>
    </>
  );
}
