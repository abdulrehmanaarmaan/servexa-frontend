"use client";

import { useEffect, useRef, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { authService } from "@/services/auth.service";

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;

  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      width?: number;
      text?:
        | "signin_with"
        | "signup_with"
        | "continue_with"
        | "signin";
      shape?:
        | "rectangular"
        | "pill"
        | "circle"
        | "square";
    },
  ) => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleWindow extends Window {
  google?: {
    accounts: GoogleAccounts;
  };
}

declare const window: GoogleWindow;

const GOOGLE_SCRIPT_SRC =
  "https://accounts.google.com/gsi/client";

function getSafeCallbackUrl(
  callbackUrl: string | null,
): string | null {
  if (!callbackUrl) {
    return null;
  }

  /*
   * Only allow internal application paths.
   *
   * This prevents open-redirect vulnerabilities.
   */
  if (
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return null;
  }

  return callbackUrl;
}

export function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCredentialResponse = async (
      response: GoogleCredentialResponse,
    ) => {
      if (!response.credential) {
        return;
      }

      try {
        setIsLoading(true);

        const { user } =
          await authService.googleLogin(
            response.credential,
          );

          console.log(user)

        const callbackUrl = getSafeCallbackUrl(
          searchParams.get("callbackUrl"),
        );

        /*
         * Return the user to the originally requested
         * protected route when one exists.
         */
        if (callbackUrl) {
          router.replace(callbackUrl);
          return;
        }

        /*
         * Otherwise use the user's role dashboard.
         */
        if (user?.role === "CUSTOMER") {
          router.replace("/dashboard/customer");
        } else if (user?.role === "TECHNICIAN") {
          router.replace("/dashboard/technician");
        } else if (user?.role === "ADMIN") {
          router.replace("/dashboard/admin");
        } else {
          console.error(
            "Google login succeeded, but no valid user role was returned.",
          );
        }
      } catch (error) {
        console.error(
          "Google login failed:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    const initializeGoogle = () => {
      if (
        !buttonRef.current ||
        !window.google ||
        !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      ) {
        return;
      }

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: "outline",
          size: "large",
          width: 400,
          text: "signin_with",
          shape: "rectangular",
        },
      );
    };

    const existingScript =
      document.querySelector(
        `script[src="${GOOGLE_SCRIPT_SRC}"]`,
      );

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script =
      document.createElement("script");

    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;

    document.head.appendChild(script);

    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
      }
    };
  }, [router, searchParams]);

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        className="flex min-h-[44px] w-full justify-center rounded-xl transition-all [&_iframe]:!w-full [&_iframe]:!rounded-xl"
      />

      {isLoading && (
        <p className="mt-2.5 animate-pulse text-center text-xs font-medium text-slate-400">
          Signing in with Google...
        </p>
      )}
    </div>
  );
}