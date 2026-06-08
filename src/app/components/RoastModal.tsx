import { Copy, Share2, Flame } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { roastText } from "../lib/mockData";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function RoastModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Roast My Sprint
          </DialogTitle>
        </DialogHeader>
        <p className="leading-relaxed">"{roastText}"</p>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(roastText)}
          >
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
