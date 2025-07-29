import { authClient } from "@lipy/lib/providers/auth";
import {
  FormButton,
  FormImage,
  FormInput,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Form } from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AccountNav } from "./-nav";
export const Route = createFileRoute("/(dashboard)/account/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <DashboardHeader title="My Profile" />
      <AccountNav>
        <div className="space-y-4">
          <Label className="text-lg">Profile</Label>
          <UserProfile />
        </div>
      </AccountNav>
    </>
  );
}

export default function UserProfile() {
  const { data, isPending } = authClient.useSession();

  const defaultValues = {
    image: data?.user.image,
    name: data?.user.name,
    email: data?.user.email,
  };

  const form = useForm({
    // resolver: zodResolver(),
    defaultValues,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    data?.user && form.reset({ ...data?.user });
  }, [data]);

  const onSubmit = async (data: typeof defaultValues) => {
    await authClient.updateUser({ name: data.name }).then((r) => {
      if (r.error) {
        toast.error("Failed to update user");
        throw r.error;
      }

      return r.data;
    });
  };

  if (isPending) return <Spinner />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" max-w-2xl ">
        <div className="space-y-4">
          <FormImage
            name="image"
            label="Image"
            wrapperClassName="size-24"
            imageClassName=""
            alt="Profile image"
            referrerPolicy="no-referrer"
          />

          <FormInput name="name" label="Name" placeholder="John Doe" />
          <FormInput
            type="email"
            name="email"
            label="Email"
            placeholder="jhon@example.com"
            readOnly
          />

          <FormButton className="w-full lg:w-fit">Update profile</FormButton>
        </div>
      </form>
    </Form>
  );
}
