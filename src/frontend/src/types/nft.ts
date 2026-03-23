export type Value =
  | { Text: string }
  | { Nat: bigint }
  | { Int: bigint }
  | { Blob: Uint8Array }
  | { Array: Value[] }
  | { Map: [string, Value][] };

export interface Account {
  owner: any; // Principal
  subaccount: [] | [Uint8Array];
}

export interface NFTMetadata {
  tokenId: bigint;
  name: string;
  description: string;
  image: string;
}

export type TransferResult =
  | { Ok: bigint }
  | {
      Err:
        | { Unauthorized: null }
        | { NonExistingTokenId: null }
        | { InvalidRecipient: null };
    };

export function extractMetadata(entries: [string, Value][]): {
  name: string;
  description: string;
  image: string;
} {
  let name = "Unnamed NFT";
  let description = "No description";
  let image = "";

  for (const [key, val] of entries) {
    if (key === "icrc7:name" && "Text" in val) name = val.Text;
    if (key === "icrc7:description" && "Text" in val) description = val.Text;
    if (key === "icrc7:image" && "Text" in val) image = val.Text;
  }

  return { name, description, image };
}
