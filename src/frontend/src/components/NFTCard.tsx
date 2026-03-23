import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { NFTMetadata } from "../types/nft";
import { TransferDialog } from "./TransferDialog";

interface NFTCardProps {
  nft: NFTMetadata;
  index: number;
}

export function NFTCard({ nft, index }: NFTCardProps) {
  const [transferOpen, setTransferOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        data-ocid={`gallery.item.${index + 1}`}
        className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:border-primary/30 hover:shadow-glow-sm transition-all duration-300"
      >
        {/* Image */}
        <div className="aspect-square bg-muted relative overflow-hidden">
          {nft.image && !imgError ? (
            <img
              src={nft.image}
              alt={nft.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-border font-mono text-xs">
              #{nft.tokenId.toString()}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-foreground truncate mb-1">
            {nft.name}
          </h3>
          {nft.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {nft.description}
            </p>
          )}
          <Button
            data-ocid={`gallery.item.${index + 1}.button`}
            variant="outline"
            size="sm"
            onClick={() => setTransferOpen(true)}
            className="w-full border-border hover:border-primary/50 hover:text-primary transition-colors"
          >
            Transfer
            <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.article>

      <TransferDialog
        nft={nft}
        open={transferOpen}
        onOpenChange={setTransferOpen}
      />
    </>
  );
}
