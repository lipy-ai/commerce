import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import {
  Fragment,
  type JSX,
  type ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import Loading from "../ui/loading";
import { FormButton } from "./elements";

type MultiStepLayoutProps = {
  id: string;
  title: string;
  description: string;
  children: () => JSX.Element;
};

type CtxType = { data: Record<string, any> | null };

const Ctx = createContext<CtxType>({ data: null });

export function MultiStepLayout({
  loading,
  steps,
  onSubmit,
  onSuccess,
  customBtn,
}: {
  customBtn: ReactNode;
  loading: boolean;
  steps: MultiStepLayoutProps[];
  onSubmit: (data: CtxType) => Promise<void>;
  onSuccess?: () => void;
}) {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { isMobile } = useViewport();
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState<CtxType>({ data: null });

  const form = useForm({
    defaultValues: {},
  });

  const totalSteps = steps.length;

  const activeStep = steps[step - 1];

  const Comp = activeStep.children as any;

  const handleBack = () => {
    if (step === 1) return router.history.back();
    setStep((s) => s - 1);
  };

  const handleSubmit = async (data: any) => {
    setData((p: any) => ({ ...p, [activeStep.id]: data }));
    if (totalSteps === step)
      return await onSubmit(data)
        .then(() => {
          setSuccess(true);
          onSuccess?.();
        })
        .catch(() => setSuccess(false));
    setStep((s) => s + 1);
  };

  const Component = (
    <Form {...form}>
      <form
        className="flex h-screen overflow-auto"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {success ? (
          <div className="m-auto w-full flex items-center justify-center relative z-20 bg-background min-h-screen">
            <div className="h-20 w-20 bg-primary flex items-center justify-center rounded-full">
              <Check className="size-16 stroke-2 text-primary-foreground" />
            </div>
          </div>
        ) : loading || form.formState.isSubmitting ? (
          <div className="relative z-20 bg-background min-h-screen w-full flex items-center justify-center">
            <Loading title="" description="" />
          </div>
        ) : (
          <div className="max-w-xl m-auto w-full min-h-screen flex flex-col overflow-auto relative z-20">
            <div className="w-full p-4 md:p-8 bg-card/95 space-y-4 flex-1 rounded-none lg:rounded-2xl">
              {customBtn ? (
                customBtn
              ) : (
                <Button
                  type="button"
                  variant={"outline"}
                  size={"icon"}
                  disabled={step === 0}
                  onClick={handleBack}
                >
                  <ArrowLeft />
                </Button>
              )}

              <CardHeader>
                {/* <div className="flex justify-center items-center mb-4">
									<Link to={"/"}>
										<img
											src="/logo/ico.png"
											alt="Lipy"
											width={75}
											height={75}
											className="rounded-md"
										/>
									</Link>
								</div> */}
                <div className="text-center">
                  <CardDescription>
                    {step} of {totalSteps}
                  </CardDescription>
                  <CardDescription>{activeStep.description}</CardDescription>

                  <CardTitle className="text-xl">{activeStep.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="md:px-0 flex flex-col border-0 shadow-none">
                <Comp />
              </CardContent>
              <div className="gap-4 flex w-full lg:justify-end mt-auto">
                {!isMobile && (
                  <Button
                    onClick={handleBack}
                    type="button"
                    variant={"outline"}
                    size={"icon-lg"}
                    disabled={step === 0}
                  >
                    <ArrowLeft />
                  </Button>
                )}
                <FormButton className="flex-1" size={"lg"}>
                  {step === totalSteps ? "Submit" : "Next Step"}
                </FormButton>
              </div>
            </div>
          </div>
        )}
        <div className="h-screen overflow-hidden fixed z-10 md:sticky top-0 flex-1">
           
          <img
            src="/assets/store.jpg"
            alt="Store"
            className="size-full object-cover brightness-120 md:brightness-100"
          />
        </div>
      </form>
    </Form>
  );

  if (loading) {
    return (
      <div className="p-8 flex-1 flex flex-col">
        <Loading />
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ data }}>
      <Fragment key={step}>{Component}</Fragment>
    </Ctx.Provider>
  );
}

export const useMultiStepForm = () => {
  return useContext(Ctx);
};
