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

// Google Identity Services limits: width 200-400px, "large" button is 40px tall.
const GOOGLE_MIN_WIDTH = 200;
const GOOGLE_MAX_WIDTH = 400;
const GOOGLE_BUTTON_HEIGHT = 40;

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

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function GoogleLoginButton() {
  // Outer box that defines the visible size (matches the other buttons)
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Element the real (invisible) Google button is rendered into
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
    const wrapper = wrapperRef.current;
    const button = buttonRef.current;

    if (!wrapper || !button) {
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
      if (!isMounted || !googleId) {
        return;
      }

      const rect = wrapper.getBoundingClientRect();

      if (rect.width <= 0) {
        return;
      }

      const width = Math.max(
        GOOGLE_MIN_WIDTH,
        Math.min(GOOGLE_MAX_WIDTH, Math.floor(rect.width)),
      );

      // Stretch the invisible Google button so it covers the whole visible
      // button, even when the container is wider than Google's 400px maximum.
      const scaleX = rect.width / width;
      const scaleY = rect.height / GOOGLE_BUTTON_HEIGHT;

      button.style.width = `${width}px`;
      button.style.transformOrigin = "top left";
      button.style.transform = `scale(${scaleX}, ${scaleY})`;

      if (width === lastRenderedWidth) {
        return;
      }

      lastRenderedWidth = width;
      button.replaceChildren();

      googleId.renderButton(button, {
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

          resizeObserver.observe(wrapper);
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
      button.replaceChildren();
    };
  }, [handleCredential]);

  return (
    <div className="w-full min-w-0">
      <div
        ref={wrapperRef}
        className="group relative h-11 w-full overflow-hidden rounded-xl focus-within:ring-2 focus-within:ring-teal-400/60"
      >
        {/* Visible button: white background with dark text for strong contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none flex h-full w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition-colors group-hover:border-slate-400 group-hover:bg-slate-100"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </div>

        {/* Real Google button: invisible, sits on top and receives the click */}
        <div
          className={`absolute inset-0 overflow-hidden opacity-[0.01] ${
            isLoading ? "pointer-events-none" : ""
          }`}
        >
          <div ref={buttonRef} />
        </div>
      </div>

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