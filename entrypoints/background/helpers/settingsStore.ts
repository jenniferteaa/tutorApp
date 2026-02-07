export async function seedDefaultSettings() {
  try {
    await browser.storage.local.set({
      "vibetutor-settings": {
        stealthMode: false,
        autoHide: false,
        opacity: 0.95,
        widgetPosition: { x: 20, y: 20 },
      },
      "vibetutor-notes": [],
    });
  } catch (error) {
    console.error("VibeTutor: failed to seed default settings", error);
  }
}
