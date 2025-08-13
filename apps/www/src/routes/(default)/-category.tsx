import { publicProductApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";

export default function Category() {
  const { data } = useAPIQuery(publicProductApi.category[":name"], "$get", {
    param: { name: "all" },
  });
  return (
    <div className="flex flex-wrap justify-around md:justify-start gap-4 max-w-7xl m-auto p-4 md:p-8">
      {data?.map((d) => (
        <div key={d.id} className="max-w-24 md:max-w-32">
          <img src={d.image || ""} alt={d.title || ""} className="mb-1" />
          <p className="text-sm md:text-base font-semibold text-muted-foreground text-center">
            {d.title}
          </p>
        </div>
      ))}
    </div>
  );
}
