"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleButtonOptions {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  width?: number;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  type?: "standard" | "icon";
  logo_alignment?: "left" | "center";
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
}

interface GoogleWindow extends Window {
  google?: {
    accounts: {
      id: GoogleAccountsId;
    };
  };
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function getSafeCallbackUrl(callbackUrl: string | null): string | null {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return null;
  }

  return callbackUrl;
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const googleWindow = window as GoogleWindow;

    if (googleWindow.google?.accounts?.id) {
      resolve();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    if (!script) {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      cleanup();

      if (googleWindow.google?.accounts?.id) {
        resolve();
      } else {
        reject(new Error("Google Identity Services failed to initialize."));
      }
    };

    const handleError = () => {
      cleanup();
      reject(new Error("Failed to load Google sign-in."));
    };

    const cleanup = () => {
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    // The script may have finished loading before listeners were added.
    if (googleWindow.google?.accounts?.id) {
      cleanup();
      resolve();
    }
  });
}

export function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const initializeGoogle = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!clientId) {
          throw new Error("Google sign-in is not configured.");
        }

        await loadGoogleScript();

        if (!isMounted || !buttonRef.current) {
          return;
        }

        const googleWindow = window as GoogleWindow;
        const googleId = googleWindow.google?.accounts.id;

        if (!googleId) {
          throw new Error("Google sign-in could not be initialized.");
        }

        const container = buttonRef.current;
        container.replaceChildren();

        googleId.initialize({
          client_id: clientId,

          callback: async (response) => {
            if (!response.credential || !isMounted) {
              return;
            }

            setIsLoading(true);
            setErrorMessage("");

            try {
              const { user } = await authService.googleLogin(
                response.credential,
              );

              if (!isMounted) {
                return;
              }

              const callbackUrl = getSafeCallbackUrl(
                searchParams.get("callbackUrl"),
              );

              if (callbackUrl) {
                router.replace(callbackUrl);
                return;
              }

              switch (user?.role) {
                case "CUSTOMER":
                  router.replace("/dashboard/customer");
                  break;

                case "TECHNICIAN":
                  router.replace("/dashboard/technician");
                  break;

                case "ADMIN":
                  router.replace("/dashboard/admin");
                  break;

                default:
                  setErrorMessage(
                    "Sign-in succeeded, but your account role could not be identified.",
                  );
              }
            } catch (error) {
              if (isMounted) {
                setErrorMessage(
                  error instanceof Error
                    ? error.message
                    : "Google sign-in failed. Please try again.",
                );
              }
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          },
        });

        // Google supports widths up to 400px.
        const width = Math.min(
          400,
          Math.max(200, Math.floor(container.clientWidth)),
        );

        googleId.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "medium",
          width,
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        });
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load Google sign-in.",
          );
        }
      }
    };

    void initializeGoogle();

    return () => {
      isMounted = false;
      buttonRef.current?.replaceChildren();
    };
  }, [router, searchParams]);

  return (
    <div className="w-full">
      <div
        ref={buttonRef}
        className="flex min-h-10 w-full justify-center overflow-hidden"
      />

      {isLoading && (
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        <p
          role="status"
          className="mt-2.5 animate-pulse text-center text-xs font-medium text-slate-400"
        >
          Signing in with Google...
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="mt-2 text-center text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
