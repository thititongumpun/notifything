import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-[var(--space-sm)] py-[var(--space-md)]">
      <div className="w-full min-w-0 max-w-[25rem]">
        <SignIn />
      </div>
    </div>
  );
}
