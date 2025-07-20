import { RefreshCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <>
      <Button variant={"outline"} size={"icon-sm"} onClick={() => zoomIn()}>
        <ZoomIn />
      </Button>
      <Button variant={"outline"} size={"icon-sm"} onClick={() => zoomOut()}>
        <ZoomOut />
      </Button>
      <Button
        variant={"outline"}
        size={"icon-sm"}
        onClick={() => resetTransform()}
      >
        <RefreshCcw />
      </Button>
    </>
  );
};

export default function ZoomImg({ src }: { src: string }) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-">
        <img
          src={src}
          alt="test"
          className="size-24 border rounded bg-card object-cover"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-none h-screen w-screen max-h-none max-w-none rounded-none">
        <TransformWrapper>
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <Controls />
            <DialogClose className="" asChild>
              <Button variant={"outline"} size={"icon-sm"}>
                <X />
              </Button>
            </DialogClose>
          </div>
          <TransformComponent>
            <img
              src={src}
              alt="test"
              className="h-screen object-contain w-screen"
            />
          </TransformComponent>
        </TransformWrapper>
      </DialogContent>
    </Dialog>
  );
}
