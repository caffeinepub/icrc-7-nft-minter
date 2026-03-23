import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hexagon, Image, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useMyNFTs } from "../hooks/useQueries";
import { NFTCard } from "./NFTCard";

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2"];

interface NFTGalleryProps {
  principalText: string;
}

export function NFTGallery({ principalText }: NFTGalleryProps) {
  const {
    data: nfts,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyNFTs(principalText);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            My Collection
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {nfts
              ? `${nfts.length} token${nfts.length !== 1 ? "s" : ""}`
              : "Loading..."}
          </p>
        </div>
        <Button
          data-ocid="gallery.secondary_button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-border hover:border-primary/50 gap-2"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isError && (
        <div
          data-ocid="gallery.error_state"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center"
        >
          <p className="text-destructive text-sm">
            Failed to load your NFTs. Please try refreshing.
          </p>
        </div>
      )}

      {isLoading && (
        <div
          data-ocid="gallery.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {SKELETON_KEYS.map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-9 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && nfts && nfts.length === 0 && (
        <motion.div
          data-ocid="gallery.empty_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border border-dashed border-border rounded-2xl"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Hexagon
                className="w-8 h-8 text-muted-foreground/40"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No NFTs yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            You don&apos;t own any tokens in this collection. Use the Mint form
            to create your first NFT.
          </p>
          <div className="mt-2 flex justify-center">
            <Image className="w-4 h-4 text-primary/40" />
          </div>
        </motion.div>
      )}

      {!isLoading && !isError && nfts && nfts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft, index) => (
            <NFTCard key={nft.tokenId.toString()} nft={nft} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
