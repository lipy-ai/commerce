import { adminCategoryApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { getAPIQueryKey } from "@lipy/lib/utils/useQueryClient";
import { useMutationState } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { produce } from "immer";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
export type CategoryContext = {
  data: InferResponseType<typeof adminCategoryApi.index.$get> | undefined;
  isLoading: boolean;
  shouldPrompt: boolean;
  setShouldPrompt: (v: boolean) => void;
};

const Context = createContext<CategoryContext>({} as any);

export const CategoryProvider = ({
  children,
  query,
}: {
  children: ReactNode;
  query?: InferRequestType<typeof adminCategoryApi.index.$get>["query"];
}) => {
  const [shouldPrompt, setShouldPrompt] = useState(false);

  const q = useAPIQuery(
    adminCategoryApi.index,
    "$get",
    {
      query: query!,
    },
    { enabled: !!query }
  );

  const deleteVars = useMutationState({
    filters: {
      mutationKey: getAPIQueryKey(adminCategoryApi.index, "$delete"),
      status: "pending",
    },
    select: (mutation) =>
      mutation.state.variables as InferRequestType<
        typeof adminCategoryApi.index.$delete
      >,
  });

  const updateVars = useMutationState({
    filters: {
      mutationKey: getAPIQueryKey(adminCategoryApi.index, "$patch"),
      status: "pending",
    },
    select: (mutation) =>
      mutation.state.variables as InferRequestType<
        typeof adminCategoryApi.index.$patch
      >,
  });

  const createVars = useMutationState({
    filters: {
      mutationKey: getAPIQueryKey(adminCategoryApi.index, "$post"),
      status: "success",
    },
    select: (mutation) =>
      mutation.state.data as InferResponseType<
        typeof adminCategoryApi.index.$post
      >,
  });

  const data = useMemo(() => {
    if (!q?.data?.items) return q.data;

    let result: NonNullable<typeof q.data>["items"] = [...q.data.items];

    if (deleteVars.length > 0) {
      const toDeleteIds = new Set(deleteVars.map((v) => v.json.ids[0]));
      result = result.filter((item) => !toDeleteIds.has(item.id));
    }

    if (createVars.length > 0) {
      for (const v of createVars) {
        if (v.parentId) {
          result = produce(result, (d) => {
            const findIdx = d.findIndex((f) => f.id === v.parentId);
            if (findIdx !== -1) {
              d[findIdx].items = [...d[findIdx].items, v];
            }
            return d;
          });
        } else {
          result = [
            ...result.filter((m) => m.id !== v.id),
            { ...v, items: [] },
          ];
        }
      }
    }

    if (updateVars.length > 0) {
      const patchMap = new Map(updateVars.map((v) => [v.json.id, v.json]));

      result = produce(result, (dr) => {
        for (let d of dr) {
          if (patchMap.has(d.id)) {
            d = { ...d, ...patchMap.get(d.id) };
          }
          const idx = d.items.findIndex((i) => patchMap.has(i.id));
          if (idx !== -1) {
            d.items[idx] = {
              ...d.items[idx],
              ...patchMap.get(d.items[idx].id),
            };
          }
        }
        return dr;
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

export const useCategory = () => useContext(Context);
