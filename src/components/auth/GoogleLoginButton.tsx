"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

let googleScriptPromise: Promise<void> | null = null;

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
  const googleWindow = window as GoogleWindow;

  if (googleWindow.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    const handleLoad = () => {
      cleanup();

      if (googleWindow.google?.accounts?.id) {
        resolve();
      } else {
        googleScriptPromise = null;
        reject(new Error("Google Identity Services failed to initialize."));
      }
    };

    const handleError = () => {
      cleanup();
      googleScriptPromise = null;
      reject(new Error("Failed to load Google sign-in."));
    };

    const cleanup = () => {
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };

    if (!script) {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
    }

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!script.isConnected) {
      document.head.appendChild(script);
    }

    // Handle a script that became ready before the listeners were attached.
    if (googleWindow.google?.accounts?.id) {
      cleanup();
      resolve();
    }
  });

  return googleScriptPromise;
}

export function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");

  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        setErrorMessage("Google did not return a valid credential.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const { user } = await authService.googleLogin(response.credential);

        const callbackUrl = getSafeCallbackUrl(callbackUrlParam);

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
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Google sign-in failed. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [callbackUrlParam, router],
  );

  useEffect(() => {
    const container = buttonRef.current;

    if (!container) {
      return;
    }

    let isMounted = true;
    let resizeObserver: ResizeObserver | undefined;
    let googleId: GoogleAccountsId | undefined;
    let lastRenderedWidth = 0;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setErrorMessage("Google sign-in is not configured.");
      return;
    }

    const renderResponsiveButton = () => {
      if (!isMounted || !googleId || !container) {
        return;
      }

      const containerWidth = Math.floor(
        container.getBoundingClientRect().width,
      );

      if (containerWidth <= 0) {
        return;
      }

      // Google Identity Services supports button widths up to 400px.
      const width = Math.min(400, containerWidth);

      if (width === lastRenderedWidth) {
        return;
      }

      lastRenderedWidth = width;
      container.replaceChildren();

      googleId.renderButton(container, {
        type: "standard",
        theme: "outline",
        size: "large",
        width,
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    };

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();

        if (!isMounted) {
          return;
        }

        const googleWindow = window as GoogleWindow;
        googleId = googleWindow.google?.accounts.id;

        if (!googleId) {
          throw new Error("Google sign-in could not be initialized.");
        }

        googleId.initialize({
          client_id: clientId,
          callback: (response) => {
            if (isMounted) {
              void handleCredential(response);
            }
          },
        });

        renderResponsiveButton();

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            renderResponsiveButton();
          });

          resizeObserver.observe(container);
        } else {
          window.addEventListener("resize", renderResponsiveButton);
        }
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
      resizeObserver?.disconnect();
      window.removeEventListener("resize", renderResponsiveButton);
      container.replaceChildren();
    };
  }, [handleCredential]);

  return (
    <div className="w-full min-w-0">
      <span className="sr-only" id="google-login-label">
        Continue with Google
      </span>

      <div
        ref={buttonRef}
        className="flex min-h-11 w-full min-w-0 justify-center overflow-hidden border-0 p-0"
      />

      {isLoading && (
        <output className="mt-2.5 block animate-pulse text-center text-xs font-medium text-slate-400">
          Signing in with Google...
        </output>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="mt-2 break-words text-center text-sm leading-5 text-rose-400"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
