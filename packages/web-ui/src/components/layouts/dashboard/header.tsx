"use client";

export const DashboardHeader = ({
  title,
  label,
}: {
  title: string;
  label?: string;
}) => {
  return (
    <div className="flex justify-between gap-8 w-full p-8 items-center border-b">
      <div className="text-primary">
        {label && <p className="font-semibold text-md">{label}</p>}
        <h1 className="font-semibold text-xl">{title}</h1>
      </div>
      <div className="flex-1 flex justify-end"></div>
    </div>
  );
};
