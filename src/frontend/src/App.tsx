import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Hexagon, LogOut, Zap } from "lucide-react";
import { motion } from "motion/react";
import { LoginScreen } from "./components/LoginScreen";
import { MintForm } from "./components/MintForm";
import { NFTGallery } from "./components/NFTGallery";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useSupply } from "./hooks/useQueries";

function AppHeader({ principal }: { principal: string }) {
  const { clear } = useInternetIdentity();
  const { data: supply } = useSupply();
  const shortPrincipal =
    principal.length > 20
      ? `${principal.slice(0, 10)}...${principal.slice(-5)}`
      : principal;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Hexagon className="w-4 h-4 text-primary" strokeWidth={1.5} />
          </div>
          <span className="font-display font-bold text-foreground text-lg hidden sm:block">
            NFT Minter
          </span>
          {supply !== undefined && (
            <Badge variant="secondary" className="text-xs hidden sm:flex gap-1">
              <Zap className="w-3 h-3" />
              {supply.toString()} minted
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-muted-foreground">Connected as</p>
            <p className="font-mono text-xs text-foreground">
              {shortPrincipal}
            </p>
          </div>
          <Button
            data-ocid="header.secondary_button"
            variant="outline"
            size="sm"
            onClick={clear}
            className="border-border hover:border-destructive/50 hover:text-destructive transition-colors gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Hexagon className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <p className="text-muted-foreground text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader principal={principal!} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Hero */}
          <div className="mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Your NFT Dashboard
            </h1>
            <p className="text-muted-foreground">
              Mint new tokens or manage your existing collection on the Internet
              Computer.
            </p>
          </div>

          {/* Two-column layout on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mint Form — sidebar */}
            <div className="lg:col-span-1">
              <MintForm />
            </div>

            {/* Gallery — main area */}
            <div className="lg:col-span-2">
              <NFTGallery principalText={principal!} />
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground/50 text-xs">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-muted-foreground/40 text-xs font-mono">
            ICRC-7 · Internet Computer
          </p>
        </div>
      </footer>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
