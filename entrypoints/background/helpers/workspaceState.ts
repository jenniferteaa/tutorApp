import { WORKSPACE_STATE_KEY } from "../core/constants";

type WorkspaceState = {
  value: string;
  createdAt: number;
};

export async function setWorkspaceState(state: string) {
  const payload: WorkspaceState = { value: state, createdAt: Date.now() };
  await browser.storage.local.set({
    [WORKSPACE_STATE_KEY]: payload,
  });
}

export async function getWorkspaceState() {
  const stored = await browser.storage.local.get(WORKSPACE_STATE_KEY);
  return (stored[WORKSPACE_STATE_KEY] as WorkspaceState | undefined) ?? null;
}

export async function clearWorkspaceState() {
  await browser.storage.local.remove(WORKSPACE_STATE_KEY);
}
