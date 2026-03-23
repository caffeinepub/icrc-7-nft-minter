import { Button } from "@/components/ui/button";
import { Hexagon, Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginScreen() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glow">
              <Hexagon className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent/80 flex items-center justify-center">
              <Zap className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold mb-3 text-foreground tracking-tight">
          ICRC-7 NFT Minter
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          Mint, collect, and transfer NFTs on the Internet Computer.
        </p>
        <p className="text-muted-foreground/60 text-sm mb-10">
          Fully on-chain. No gas fees. No middlemen.
        </p>

        <Button
          data-ocid="login.primary_button"
          onClick={login}
          disabled={isLoggingIn || isInitializing}
          size="lg"
          className="w-full h-14 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-glow transition-all duration-200"
        >
          {isLoggingIn || isInitializing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isInitializing ? "Initializing..." : "Connecting..."}
            </>
          ) : (
            "Connect with Internet Identity"
          )}
        </Button>

        <p className="mt-6 text-xs text-muted-foreground/50">
          Internet Identity is a secure, pseudonymous authentication system
          native to the IC.
        </p>
      </motion.div>
    </div>
  );
}
