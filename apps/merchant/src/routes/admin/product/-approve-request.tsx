import { adminProductApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import type { PRODUCT_STATUS } from "@lipy/server/db/schema";
import { Button } from "@lipy/web-ui/components/ui/button";
import type { InferResponseType } from "hono/client";
import { toast } from "sonner";

type Response = InferResponseType<
  typeof adminProductApi.index.$get
>["items"][number];
export function ApproveProduct({ data }: { data: Response }) {
  const opts = {
    onSuccess: () => {
      toast.success("Product approved");
    },
  };
  const approveMutation = useAPIMutation(
    adminProductApi[":id"].status,
    "$patch",
    opts
  );

  const handle = async (status: (typeof PRODUCT_STATUS)[number]) => {
    await approveMutation.mutateAsync({
      param: {
        id: data?.id,
      },
      json: {
        status: status,
      },
    });
  };
  return (
    <Button onClick={() => handle("published")} size={"sm"}>
      Approve
    </Button>
  );
}
