import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { IDefaultDialog } from "@/types/interface";

export default function DefaultDialog(props: IDefaultDialog) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {/* <DialogTrigger asChild>
      <Button variant="outline">Share</Button>
    </DialogTrigger> */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        {props.children}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
