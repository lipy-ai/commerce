// @ts-nocheck

import { adminReviewProductApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { getAPIQueryKey } from "@lipy/lib/utils/useQueryClient";
import { useMutationState } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
export type ProductContext = {
  data: InferResponseType<typeof adminReviewProductApi.index.$get> | undefined;
  isLoading: boolean;
  shouldPrompt: boolean;
  setShouldPrompt: (v: boolean) => void;
};

const Context = createContext<ProductContext>({} as any);

export const ProductProvider = ({
  children,
  query,
}: {
  children: ReactNode;
  query?: InferRequestType<typeof adminReviewProductApi.index.$get>["query"];
}) => {
  const [shouldPrompt, setShouldPrompt] = useState(false);

  const q = useAPIQuery(
    adminReviewProductApi.index,
    "$get",
    {
      query: query!,
    },
    { enabled: !!query }
  );

  const deleteVars = useMutationState({
    filters: {
      mutationKey: getAPIQueryKey(adminReviewProductApi.index, "$delete"),
      status: "pending",
    },
    select: (mutation) =>
      mutation.state.variables as InferRequestType<
        typeof adminReviewProductApi.index.$delete
      >,
  });

  const updateVars = useMutationState({
    filters: {
      mutationKey: getAPIQueryKey(adminReviewProductApi[":id"], "$patch"),
      status: "pending",
    },
    select: (mutation) =>
      mutation.state.variables as InferRequestType<
        (typeof adminReviewProductApi)[":id"]["$patch"]
      >,
  });

  const createVars = useMutationState({
    filters: {
      mutationKey: getAPIQueryKey(adminReviewProductApi.index, "$post"),
      status: "success",
    },
    select: (mutation) => {
      const d = mutation.state.data as InferResponseType<
        typeof adminReviewProductApi.index.$post
      >;
      return { ...d, category: { id: d.category } as any };
    },
  });

  const data = useMemo(() => {
    if (!q?.data?.items) return q.data;

    let result: NonNullable<typeof q.data>["items"] = [...q.data.items];

    if (deleteVars.length > 0) {
      const toDeleteIds = new Set(deleteVars.map((v) => v.json.ids[0]));
      result = result.filter((item) => !toDeleteIds.has(item.id));
    }

    if (createVars.length > 0) {
      result = [...createVars, ...result];
    }

    if (updateVars.length > 0) {
      const patchMap = new Map(
        updateVars.map(({ param, json }) => [
          param.id,
          {
            ...json,
            category: { id: json.category } as any,
            variants:
              json.variants?.map((m) => ({ ...m, productId: param.id })) || [],
          } satisfies Partial<(typeof result)[0]>,
        ])
      );

      result = result.map((item) => {
        if (patchMap.has(item.id)) {
          return {
            ...item,
            ...patchMap.get(item.id),
          };
        }
        return item;
      });
    }
    q.data.items = result;
    return q.data;
  }, [q.data, deleteVars, updateVars, createVars]);

  return (
    <Context.Provider
      value={{
        data,
        isLoading: q.isLoading,
        setShouldPrompt,
        shouldPrompt,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useProduct = () => useContext(Context);
