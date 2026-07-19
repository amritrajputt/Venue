import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {auth} from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Venue with your Google account.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard/events");
  }
  const { callbackUrl } = await searchParams;

  return (
      <Card className="w-full max-w-sm border-border/80 shadow-sm">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in with Google to create and manage your events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignInButton callbackUrl={callbackUrl} />
          <p className="text-center text-xs text-muted-foreground">
            We only request the permissions needed to identify your account.
            You can revoke access anytime from Google settings.
          </p>
        </CardContent>
      </Card>
  );
}