export async function handleSaveNotes(payload: { notes: unknown[] }) {
  try {
    await browser.storage.local.set({ "vibetutor-notes": payload.notes });
    return { success: true };
  } catch (error) {
    console.error("VibeTutor: failed to save notes", error);
    return { success: false, error: "Storage error" };
  }
}
