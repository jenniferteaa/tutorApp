export function isSupabaseLoginPayload(payload: unknown): payload is {
  email: string;
  password: string;
} {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const maybe = payload as {
    email?: unknown;
    password?: unknown;
  };
  return typeof maybe.email === "string" && typeof maybe.password === "string";
}

export function isSupabaseSignupPayload(payload: unknown): payload is {
  fname: string;
  lname: string;
  email: string;
  password: string;
} {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const maybe = payload as {
    fname?: unknown;
    lname?: unknown;
    email?: unknown;
    password?: unknown;
  };
  return (
    typeof maybe.fname === "string" &&
    typeof maybe.lname === "string" &&
    typeof maybe.email === "string" &&
    typeof maybe.password === "string"
  );
}
