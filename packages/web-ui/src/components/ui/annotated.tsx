import { FormDescription, FormLabel } from "./form";

export const AnnotatedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="grid divide-y gap-0 border-y border-collapse">
      {children}
    </div>
  );
};

export const AnnotatedSection = ({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="grid md:grid-cols-[30%_auto] gap-0 md:gap-8 divide-x">
      <div className="px-4 pb-4 pt-8 md:p-4">
        <FormLabel className="mb-1">{title}</FormLabel>
        <FormDescription>{desc}</FormDescription>
      </div>
      <div className="px-4 pb-8 md:pt-4">{children}</div>
    </div>
  );
};
