import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import useSaveUserEffect from "./hooks/useSaveUserEffect";
import { QuestSearch } from "./components/Quests";

export default function App() {
  return (
    <div className="dark container max-w-5xl grid grid-rows-layout justify-center ">
      <header className="w-full font-display flex flex-row justify-between items-center pt-4 mt-4 ">
        <h1 className="text-6xl font-extrabold text-center">questferret</h1>
        <Authenticated>
          <UserButton afterSignOutUrl="#" />
        </Authenticated>
        <Unauthenticated>
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className=" p-7 bg-primary-foreground hover:bg-primary/50 font-display text-3xl"
            >
              Sign in
            </Button>
          </SignInButton>
        </Unauthenticated>
      </header>
      <main className="w-full flex flex-col gap-8 py-4 my-4 font-serif">
        <Authenticated>
          <SignedIn />
        </Authenticated>
        <Unauthenticated>
          <QuestSearch />
        </Unauthenticated>
      </main>
      <footer className="w-full text-center font-serif text-2xl my-4 py-4 ">
        Conjured with{" "}
        <a
          className="font-display hover:text-primary-foreground/80 text-primary-foreground"
          href="https://convex.dev"
          target="_blank"
        >
          Convex
        </a>
        ,{" "}
        <a
          className="font-display hover:text-primary-foreground/80 text-primary-foreground"
          href="https://clerk.com"
          target="_blank"
        >
          Clerk
        </a>{" "}
        &{" "}
        <a
          className="font-display hover:text-primary-foreground/80 text-primary-foreground"
          href="https://vitejs.dev"
          target="_blank"
        >
          Vite
        </a>{" "}
        at the{" "}
        <a
          className="font-display hover:text-primary-foreground/80 text-primary-foreground"
          href="https://www.learnwithjason.dev/"
          target="_blank"
        >
          Learn With Jason
        </a>{" "}
        college of magic
      </footer>
    </div>
  );
}

function SignedIn() {
  const { user } = useUser();
  const userId = useSaveUserEffect();
  if (!userId) return null;
  return (
    <div className="">
      <p>Welcome {user?.firstName}!</p>
      <div className="flex gap-4 items-center">
        This is you:
        <UserButton afterSignOutUrl="#" />
      </div>
    </div>
  );
}
