import { fetchJsonWithTimeout } from "../../helpers/httpClient";
import { BACKEND_BASE_URL } from "../constants";

export async function checkBackendHealth() {
  return fetchJsonWithTimeout<{ status?: string }>(
    `${BACKEND_BASE_URL.replace(/\/$/, "")}/health`,
    { method: "GET" },
    4_000,
  );
}
