import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@icp-sdk/core/principal";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTransferNFT } from "../hooks/useQueries";
import type { NFTMetadata } from "../types/nft";

interface TransferDialogProps {
  nft: NFTMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferDialog({
  nft,
  open,
  onOpenChange,
}: TransferDialogProps) {
  const [recipient, setRecipient] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const { mutateAsync: transfer, isPending } = useTransferNFT();

  const validatePrincipal = (text: string): boolean => {
    if (!text.trim()) {
      setRecipientError("Recipient principal is required");
      return false;
    }
    try {
      Principal.fromText(text.trim());
      setRecipientError("");
      return true;
    } catch {
      setRecipientError("Invalid principal ID format");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePrincipal(recipient)) return;

    try {
      await transfer({
        tokenId: nft.tokenId,
        recipientPrincipal: recipient.trim(),
      });
      toast.success(
        `Token #${nft.tokenId.toString()} transferred successfully`,
      );
      setRecipient("");
      setRecipientError("");
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transfer failed";
      toast.error(message);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setRecipient("");
      setRecipientError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="transfer.dialog"
        className="bg-popover border-border max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Transfer NFT
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send <span className="text-foreground font-medium">{nft.name}</span>{" "}
            (Token #{nft.tokenId.toString()}) to another principal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Token ID</p>
            <p className="font-mono text-sm text-foreground">
              {nft.tokenId.toString()}
            </p>
          </div>

          <div>
            <Label
              htmlFor="transfer-recipient"
              className="text-sm font-medium mb-2 block"
            >
              Recipient Principal ID
            </Label>
            <Input
              id="transfer-recipient"
              data-ocid="transfer.input"
              placeholder="e.g. aaaaa-aa or principal-id..."
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (recipientError) validatePrincipal(e.target.value);
              }}
              className="bg-muted/50 border-border focus:border-primary/50 font-mono text-sm"
              disabled={isPending}
              autoComplete="off"
            />
            {recipientError && (
              <p
                data-ocid="transfer.error_state"
                className="text-destructive text-xs mt-1"
              >
                {recipientError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              data-ocid="transfer.cancel_button"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              data-ocid="transfer.confirm_button"
              type="submit"
              disabled={isPending || !recipient.trim()}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  Transfer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
