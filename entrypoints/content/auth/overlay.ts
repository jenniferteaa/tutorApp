import { sendBackendHealthCheck } from "../messaging";
import { state } from "../state";
import {
  applyAuthSuccess,
  isStrongPassword,
  loginWithCredentials,
  signupWithCredentials,
} from "./flow";

type AuthOverlayDeps = {
  stopPanelOperations: (panel: HTMLElement) => void;
  unlockPanel: (panel: HTMLElement) => void;
};

let authOverlayDeps: AuthOverlayDeps | null = null;
let authHealthInFlight = false;

const STARTING_COLOR = "#c58313";
const READY_COLOR = "#136f35";
const AUTH_HEALTH_POLL_INTERVAL_MS = 5000;
const AUTH_HEALTH_POLL_MAX_ATTEMPTS = 24; // 120 seconds total
const AUTH_SERVER_STARTING = "Starting up the server...";
const AUTH_SERVER_READY = "Server started. Logging you in...";
const AUTH_SERVER_TIMEOUT =
  "Server is taking longer than usual. Please try again.";

async function ensureBackendReadyForAuth(errorBox: HTMLElement | null) {
  if (authHealthInFlight) return false;
  authHealthInFlight = true;
  try {
    const initial = await sendBackendHealthCheck();
    if (initial?.success) return true;
    if (errorBox) {
      errorBox.textContent = AUTH_SERVER_STARTING;
      errorBox.style.color = STARTING_COLOR;
      errorBox.style.display = "block";
    }
    for (
      let attempt = 0;
      attempt < AUTH_HEALTH_POLL_MAX_ATTEMPTS;
      attempt += 1
    ) {
      await new Promise((resolve) =>
        setTimeout(resolve, AUTH_HEALTH_POLL_INTERVAL_MS),
      );
      const health = await sendBackendHealthCheck();
      if (health?.success) {
        if (errorBox) {
          errorBox.textContent = AUTH_SERVER_READY;
          errorBox.style.color = READY_COLOR;
          errorBox.style.display = "block";
        }
        return true;
      }
      console.log("pinging again");
    }
    if (errorBox) {
      errorBox.textContent = AUTH_SERVER_TIMEOUT;
      errorBox.style.display = "block";
    }
    return false;
  } finally {
    authHealthInFlight = false;
  }
}

export function configureAuthOverlay(next: AuthOverlayDeps) {
  authOverlayDeps = next;
}

function getAuthOverlayDeps(): AuthOverlayDeps {
  if (!authOverlayDeps) {
    throw new Error("Auth overlay dependencies not configured");
  }
  return authOverlayDeps;
}

export function ensureAuthPrompt(panel: HTMLElement, message?: string) {
  const existing = panel.querySelector<HTMLElement>(".tutor-panel-auth");
  if (existing) {
    if (message) {
      const errorBox = existing.querySelector<HTMLElement>(".auth-error");
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.style.display = "block";
      }
    }
    return;
  }

  const { stopPanelOperations, unlockPanel } = getAuthOverlayDeps();
  state.suspendPanelOps = true;
  stopPanelOperations(panel);

  const authBox = document.createElement("div");
  authBox.className = "tutor-panel-auth";
  panel.appendChild(authBox);

  const setupPasswordToggle = (
    input: HTMLInputElement | null,
    toggle: HTMLButtonElement | null,
  ) => {
    if (!input || !toggle) return;
    const update = () => {
      const hidden = input.type === "password";
      toggle.setAttribute(
        "aria-label",
        hidden ? "Show password" : "Hide password",
      );
    };
    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      update();
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    update();
  };

  const renderLoginBox = (promptMessage?: string) => {
    authBox.innerHTML = `
      <div class="auth-error"></div>
      <h4>Login Required</h4>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <div class="auth-password-wrap">
        <input type="password" class="auth-password" placeholder="password" />
        <button type="button" class="auth-password-toggle" aria-label="Show password">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
            <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </div>
      <div class="auth-actions">
        <button type="button" class="auth-login">Login</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-signup">Sign up</button>
      </div>
    `;

    const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
    const passwordInput =
      authBox.querySelector<HTMLInputElement>(".auth-password");
    const login = authBox.querySelector<HTMLButtonElement>(".auth-login");
    const signup = authBox.querySelector<HTMLButtonElement>(".auth-signup");
    const toggle = authBox.querySelector<HTMLButtonElement>(
      ".auth-password-toggle",
    );
    const errorBox = authBox.querySelector<HTMLElement>(".auth-error");
    if (promptMessage && errorBox) {
      errorBox.textContent = promptMessage;
      errorBox.style.display = "block";
    }
    const clearError = () => {
      if (!errorBox) return;
      errorBox.style.display = "none";
    };
    emailInput?.addEventListener("input", clearError);
    passwordInput?.addEventListener("input", clearError);
    setupPasswordToggle(passwordInput, toggle);
    login?.addEventListener("click", async () => {
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value.trim() ?? "";
      if (!email || !password) return;
      const ready = await ensureBackendReadyForAuth(errorBox ?? null); // maybe this is returning early
      if (!ready) return;
      const resp = await loginWithCredentials(email, password);
      if (resp?.success === false) {
        if (errorBox) {
          errorBox.textContent = resp.error || "Internal server error";
          errorBox.style.display = "block";
        }
        return;
      }
      const data = (resp as { data?: { userId?: string; jwt?: string } })?.data;
      if (data?.userId && data?.jwt) {
        await applyAuthSuccess(panel, authBox, data.userId, { unlockPanel });
      } else if (errorBox) {
        errorBox.textContent = "Invalid creds";
        errorBox.style.display = "block";
      }
    });
    signup?.addEventListener("click", () => {
      renderSignupBox();
    });
  };

  const renderSignupBox = () => {
    authBox.innerHTML = `
      <div class="auth-error">Signup failed</div>
      <h4>Create account</h4>
      <div class="auth-name-row">
        <input type="text" class="auth-first-name" placeholder="First name" />
        <input type="text" class="auth-last-name" placeholder="Last name" />
      </div>
      <input type="email" class="auth-email" placeholder="you@example.com" />
      <div class="auth-password-wrap">
        <input type="password" class="auth-password" placeholder="password" />
        <button type="button" class="auth-password-toggle" aria-label="Show password">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
            <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12 18.5 19.5 12 19.5 1.5 12 1.5 12Z"></path>
            <circle cx="12" cy="12" r="3.5"></circle>
          </svg>
        </button>
      </div>
      <div class="auth-password-hint"></div>
      <div class="auth-actions">
        <button type="button" class="auth-signup-submit">Sign up</button>
        <span class="auth-sep">/</span>
        <button type="button" class="auth-back">Back to login</button>
      </div>
    `;
    const firstNameInput =
      authBox.querySelector<HTMLInputElement>(".auth-first-name");
    const lastNameInput =
      authBox.querySelector<HTMLInputElement>(".auth-last-name");
    const emailInput = authBox.querySelector<HTMLInputElement>(".auth-email");
    const passwordInput =
      authBox.querySelector<HTMLInputElement>(".auth-password");
    const signupSubmit = authBox.querySelector<HTMLButtonElement>(
      ".auth-signup-submit",
    );
    const toggle = authBox.querySelector<HTMLButtonElement>(
      ".auth-password-toggle",
    );
    const errorBox = authBox.querySelector<HTMLElement>(".auth-error");
    const passwordHint = authBox.querySelector<HTMLElement>(
      ".auth-password-hint",
    );
    const clearError = () => {
      if (!errorBox) return;
      errorBox.style.display = "none";
    };
    firstNameInput?.addEventListener("input", clearError);
    lastNameInput?.addEventListener("input", clearError);
    emailInput?.addEventListener("input", clearError);
    passwordInput?.addEventListener("input", clearError);
    setupPasswordToggle(passwordInput, toggle);
    passwordInput?.addEventListener("blur", () => {
      if (!passwordHint || !passwordInput) return;
      const value = passwordInput.value.trim();
      if (value && !isStrongPassword(value)) {
        passwordHint.textContent =
          "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
        passwordHint.style.display = "block";
      } else {
        passwordHint.style.display = "none";
      }
    });
    passwordInput?.addEventListener("input", () => {
      if (!passwordHint || !passwordInput) return;
      const value = passwordInput.value.trim();
      if (value && isStrongPassword(value)) {
        passwordHint.style.display = "none";
      }
    });

    signupSubmit?.addEventListener("click", async () => {
      const fname = firstNameInput?.value.trim() ?? "";
      const lname = lastNameInput?.value.trim() ?? "";
      const email = emailInput?.value.trim() ?? "";
      const password = passwordInput?.value.trim() ?? "";
      if (!fname || !lname || !email || !password) return;
      if (!isStrongPassword(password)) {
        if (passwordHint) {
          passwordHint.textContent =
            "Must be at least 8 characters with letter and number, no special or non-ASCII characters.";
          passwordHint.style.display = "block";
        }
        return;
      }
      const ready = await ensureBackendReadyForAuth(errorBox ?? null);
      if (!ready) return;
      const resp = await signupWithCredentials({
        fname,
        lname,
        email,
        password,
      });
      if (resp?.success === false) {
        if (errorBox) {
          errorBox.textContent = resp.error || "Internal server error";
          errorBox.style.display = "block";
        }
        return;
      }
      const data = (
        resp as {
          data?: {
            requiresVerification?: boolean;
            userId?: string;
            jwt?: string;
          };
        }
      )?.data;
      if (data?.requiresVerification) {
        renderLoginBox("Waiting for verification, check email");
      } else if (data?.userId && data?.jwt) {
        await applyAuthSuccess(panel, authBox, data.userId, { unlockPanel });
      } else if (errorBox) {
        errorBox.style.display = "block";
      }
    });

    const back = authBox.querySelector<HTMLButtonElement>(".auth-back");
    back?.addEventListener("click", () => {
      renderLoginBox();
    });
  };

  renderLoginBox(message);
}
