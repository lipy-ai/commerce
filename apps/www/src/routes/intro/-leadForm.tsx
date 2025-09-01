import { publicLandingApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
  FormButton,
  FormInput,
  FormRadioInput,
  FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useForm } from "react-hook-form";

export function LeadForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      delivery: "yes",
    },
  });

  const mutation = useAPIMutation(publicLandingApi.lead, "$post", {
    onSuccess: () => {
      toast.success("Thanks for reaching out. We will get back to you soon.");
      form.reset();
    },
  });
  const onSubmit = async (data: any) => {
    console.log(data);

    await mutation.mutateAsync({ json: data });
  };

  return (
    <div className="bg-primary py-12 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-2xl md:text-5xl font-bold  mb-4 text-background">
            Go online with Lipy
          </h1>
          <p className="text-base md:text-lg text-background max-w-2xl mx-auto leading-relaxed">
            Fill the form below and we will get back to you.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="py-4 md:p-8 space-y-6">
                {/* Form Fields */}
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                      name="name"
                      label="Shop / Restaurant / Kitchen Name"
                      placeholder="e.g., Rasoi Ghar, Delhi Delights, Mama's Kitchen"
                      required
                    />
                    <FormInput
                      name="phone"
                      label="Phone Number"
                      prefixEl="+91"
                      type="tel"
                      required
                    />

                    <FormTextarea
                      name="address"
                      label="Your Address"
                      placeholder=" Shakarpur Main Market, Near Metro Station, New Delhi"
                      required
                      className="min-h-[80px]"
                    />
                    <FormRadioInput
                      name="delivery"
                      label="Do you provide delivery services?"
                      opts={[
                        {
                          label: "Yes, we deliver orders ourselves",
                          value: "yes",
                        },
                        { label: "No, pickup only", value: "no" },
                      ]}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-center">
                  <FormButton size="lg">Submit your details</FormButton>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
