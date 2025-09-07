import { merchantProductApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Input } from "@lipy/web-ui/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lipy/web-ui/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import FormEdit from "../-form.edit";

export const Route = createFileRoute("/(dashboard)/product/add/bulk")({
  component: RouteComponent,
});

function RouteComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    }
  };

  const mutation = useAPIMutation(merchantProductApi.bulk, "$post", {
    onSuccess: (data) => {
      setText(data);
    },
  });

  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000; // process in chunks (32KB)

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  const handle = async (file: File) => {
    setLoading(true);
    const buffer = await file.arrayBuffer();

    const base64 = arrayBufferToBase64(buffer);

    await mutation.mutateAsync({
      json: { file: base64 },
    });
    setLoading(false);
  };

  useEffect(() => {
    if (text) {
      setProduct(JSON.parse(text.split("```json")[1].split("```")[0]));
    }
  }, [text]);

  console.log(product);

  return (
    <div>
      <DashboardHeader title="Bulk Upload" />
      <div className="max-w-6xl  md:p-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Upload your products</CardTitle>
            {file && (
              <Button
                onClick={() => {
                  setFile(null);
                  setProduct([]);
                }}
              >
                <RefreshCcw /> Reset
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {file ? (
              <div className="mt-6 flex flex-col items-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="size-40 object-cover rounded-lg border"
                />
                <p className="mt-2 text-sm text-muted-foreground truncate max-w-xs">
                  {file.name}
                </p>
                {product.length === 0 && (
                  <Button
                    onClick={() => handle(file)}
                    disabled={loading}
                    className="min-w-32"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Extract data"
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="border border-dashed flex flex-col gap-4 items-center justify-center h-40 rounded-md p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Upload image of your menu
                </p>
              </div>
            )}
          </CardContent>
          {product.length > 0 && <DesktopView product={product} />}
        </Card>
      </div>
    </div>
  );
}

const DesktopView = ({ product }: { product: any[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {product.map((p, index) => (
          <TableRow key={index}>
            <TableCell className=" text-base">{p.title}</TableCell>
            <TableCell>
              <FormEdit view="create" productData={p}>
                <Button>
                  <Check />
                </Button>
              </FormEdit>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
