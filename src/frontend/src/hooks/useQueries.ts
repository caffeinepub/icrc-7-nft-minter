import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type NFTMetadata,
  type TransferResult,
  extractMetadata,
} from "../types/nft";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useCollectionMetadata() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["collection-metadata"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).icrc7_collection_metadata() as Promise<
        [string, any][]
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSupply() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["supply"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return (actor as any).icrc7_supply() as Promise<bigint>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyNFTs(principalText: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<NFTMetadata[]>({
    queryKey: ["my-nfts", principalText],
    queryFn: async () => {
      if (!actor || !principalText) return [];
      const principal = Principal.fromText(principalText);
      const account = { owner: principal, subaccount: [] as [] };
      const tokenIds: bigint[] = await (actor as any).icrc7_tokens_of(account);
      if (tokenIds.length === 0) return [];
      const metadataList: ([] | [[string, any][]])[] = await (
        actor as any
      ).icrc7_token_metadata(tokenIds);
      const nfts: NFTMetadata[] = [];
      for (let i = 0; i < tokenIds.length; i++) {
        const meta = metadataList[i];
        if (meta && meta.length > 0 && meta[0]) {
          const extracted = extractMetadata(meta[0]);
          nfts.push({ tokenId: tokenIds[i], ...extracted });
        } else {
          nfts.push({
            tokenId: tokenIds[i],
            name: `NFT #${tokenIds[i].toString()}`,
            description: "",
            image: "",
          });
        }
      }
      return nfts;
    },
    enabled: !!actor && !isFetching && !!principalText,
  });
}

export function useMintNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      imageUrl,
    }: { name: string; description: string; imageUrl: string }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).mint(
        name,
        description,
        imageUrl,
      ) as Promise<bigint>;
    },
    onSuccess: () => {
      const principal = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({ queryKey: ["my-nfts", principal] });
      queryClient.invalidateQueries({ queryKey: ["supply"] });
    },
  });
}

export function useTransferNFT() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async ({
      tokenId,
      recipientPrincipal,
    }: { tokenId: bigint; recipientPrincipal: string }) => {
      if (!actor) throw new Error("Not connected");
      const to = {
        owner: Principal.fromText(recipientPrincipal),
        subaccount: [] as [],
      };
      const args = {
        from_subaccount: [] as [],
        to,
        token_id: tokenId,
        memo: [] as [],
        created_at_time: [] as [],
      };
      const result: TransferResult = await (actor as any).icrc7_transfer(args);
      if ("Err" in result) {
        const errKey = Object.keys(result.Err)[0];
        throw new Error(
          errKey === "Unauthorized"
            ? "Unauthorized: you do not own this token"
            : errKey === "NonExistingTokenId"
              ? "Token does not exist"
              : "Invalid recipient principal",
        );
      }
      return result.Ok;
    },
    onSuccess: () => {
      const principal = identity?.getPrincipal().toString();
      queryClient.invalidateQueries({ queryKey: ["my-nfts", principal] });
    },
  });
}
