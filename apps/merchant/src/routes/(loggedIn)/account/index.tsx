import FormRender, { type FormSchema } from "@web-ui/components/forms/renderer";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authClient } from "@repo-lib/providers/auth";
export const Route = createFileRoute("/(loggedIn)/account/")({
  component: RouteComponent,
});

const forms: FormSchema<any, any> = [
  {
    id: "general",
    size: "default",
    style: {
      submitBtn: {
        label: "Save Changes",
        pos: {
          horizontal: "left",
        },
      },
      editBtn: {
        label: "Edit Information",
      },
      labelPos: "left",
    },
    schema: z.object({
      firstName: z.string(),
      middleName: z.string(),
      lastName: z.string(),
      companyCountry: z.string(),
    }),
    values: {
      firstName: "Kundan",
      middleName: "Bhosale",
      lastName: "Bhosale",
      companyCountry: "IND",
    },
    elements: [
      {
        name: "image",
        fieldType: "SingleImage",
      },
      [
        {
          name: "firstName",
          fieldType: "Input",
          placeholder: "John",
          label: "First name",
          required: true,
        },
        {
          name: "middleName",
          fieldType: "Input",
          placeholder: "Jake",
          label: "Middle name",
          required: true,
        },

        {
          name: "lastName",
          fieldType: "Input",
          placeholder: "Doe",
          label: "Last name",
          required: true,
        },
      ],
      {
        name: "companyCountry",
        fieldType: "CountrySelector",
        label: "Company Location",
        required: true,
      },
    ],
  },
];

function RouteComponent() {
  const { data, isPending } = authClient.useSession();

  const handle = async (body: any) => {
    console.log(body);
    // await mutation.mutateAsync({ body }).then((r) => {
    //   // r.
    // })
  };

  return (
    <div className="max-w-5xl">
      <FormRender forms={forms} onSubmit={handle}></FormRender>
    </div>
  );
}
