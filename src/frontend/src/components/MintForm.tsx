import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2, Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useMintNFT } from "../hooks/useQueries";

export function MintForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: mint, isPending } = useMintNFT();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!imageFile || !imagePreview) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const tokenId = await mint({
        name: name.trim(),
        description: description.trim(),
        imageUrl: imagePreview,
      });
      toast.success(`NFT minted! Token ID: ${tokenId.toString()}`, {
        duration: 5000,
      });
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Minting failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Mint New NFT
          </h2>
          <p className="text-muted-foreground text-sm">
            Create a unique token on the Internet Computer
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">
            Image
          </Label>
          <button
            type="button"
            data-ocid="mint.dropzone"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative w-full border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 transition-colors duration-200 group focus:outline-none focus:border-primary/70 text-left"
            style={{ minHeight: "200px" }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                style={{ maxHeight: "280px" }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground/40 mb-3 group-hover:text-primary/60 transition-colors" />
                <p className="text-muted-foreground text-sm">
                  Drop image here or{" "}
                  <span className="text-primary">browse</span>
                </p>
                <p className="text-muted-foreground/50 text-xs mt-1">
                  PNG, JPG, GIF, WEBP
                </p>
              </div>
            )}
            {imagePreview && (
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            data-ocid="mint.upload_button"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div>
          <Label
            htmlFor="mint-name"
            className="text-sm font-medium text-foreground mb-2 block"
          >
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mint-name"
            data-ocid="mint.input"
            placeholder="e.g. Cosmic Voyager #001"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-muted/50 border-border focus:border-primary/50 focus:ring-primary/20"
            disabled={isPending}
          />
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="mint-desc"
            className="text-sm font-medium text-foreground mb-2 block"
          >
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="mint-desc"
            data-ocid="mint.textarea"
            placeholder="Describe your NFT..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-muted/50 border-border focus:border-primary/50 focus:ring-primary/20 resize-none"
            disabled={isPending}
          />
        </div>

        <Button
          data-ocid="mint.submit_button"
          type="submit"
          disabled={
            isPending || !name.trim() || !description.trim() || !imageFile
          }
          className="w-full h-12 font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-glow-sm transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting on-chain...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Mint NFT
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
