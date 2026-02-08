export async function getMonacoCodeFromTab(tabId: number) {
  return new Promise<{ ok: boolean; code?: string; error?: string }>(
    (resolve) => {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          world: "MAIN",
          func: () => {
            const monaco = (window as any).monaco; // added type casting
            if (!monaco?.editor) return { ok: false, error: "monaco not found" };

            const editors = monaco.editor.getEditors?.() || [];
            const editor = editors[0];
            if (editor?.getValue) {
              return { ok: true, code: editor.getValue() };
            }

            const models = monaco.editor.getModels?.() || [];
            if (models.length) {
              return { ok: true, code: models[0].getValue() };
            }

            return { ok: false, error: "no editor/model found" };
          },
        },
        (results) => {
          resolve(results?.[0]?.result ?? { ok: false, error: "no result" });
        },
      );
    },
  );
}
