# ICRC-7 NFT Minter

## Current State
Motoko backend is complete at `src/backend/main.mo` with the following public interface:
- `mint(name: Text, description: Text, imageUrl: Text) -> async Nat`
- `icrc7_token_metadata(tokenIds: [Nat]) -> async [?([(Text, Value)])]`
- `icrc7_owner_of(tokenIds: [Nat]) -> async [?Account]`
- `icrc7_transfer(args: TransferArgs) -> async TransferResult` where TransferArgs = { from_subaccount: ?Blob; to: Account; token_id: Nat; memo: ?Blob; created_at_time: ?Nat64 } and TransferResult = { #Ok: Nat } | { #Err: #Unauthorized | #NonExistingTokenId | #InvalidRecipient }
- `icrc7_tokens_of(account: Account) -> async [Nat]` where Account = { owner: Principal; subaccount: ?Blob }
- `icrc7_supply() -> async Nat`
- `icrc7_collection_metadata() -> async [(Text, Value)]`

## Requested Changes (Diff)

### Add
- Internet Identity authentication (login/logout)
- Minting Form: image file upload + name + description fields, calls `mint`
- Gallery View: calls `icrc7_tokens_of` with the authenticated user's Account, fetches metadata via `icrc7_token_metadata`, displays NFT cards
- Transfer UI: per-NFT modal or inline form, accepts recipient Principal ID as text, constructs `Account { owner: Principal.fromText(input); subaccount: null }`, calls `icrc7_transfer`
- Empty state for gallery (zero tokens)
- Success/error feedback for mint and transfer actions
- After successful transfer, re-fetch the token list from the canister

### Modify
- None

### Remove
- None

## Implementation Plan
1. App shell with Internet Identity login gate
2. Minting Form component -- file input (for image preview; imageUrl passed as data URL or blob-storage URL), name/description fields, submit calls `mint`, success shows new token ID
3. Gallery component -- on mount and after any mutation, calls `icrc7_tokens_of({ owner: callerPrincipal, subaccount: null })`, batch-fetches metadata, renders NFT cards with image, name, description
4. Transfer modal/panel per card -- text input for recipient Principal, constructs Account object, calls `icrc7_transfer`, handles #Ok and #Err variants, re-fetches gallery on success
5. Stable React keys on NFT cards (token ID, not array index)
6. Explicit empty-state rendering when token list is empty
