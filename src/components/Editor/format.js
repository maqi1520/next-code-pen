import * as monaco from "monaco-editor";
import PrettierWorker from "worker-loader!../../workers/prettier.worker.js";
import { createWorkerQueue } from "../../utils/workers";

export function registerDocumentFormattingEditProviders() {
  const disposables = [];
  let prettierWorker;

  const formattingEditProvider = {
    async provideDocumentFormattingEdits(model, _options, _token) {
      if (!prettierWorker) {
        prettierWorker = createWorkerQueue(PrettierWorker);
      }
      const { canceled, error, pretty } = await prettierWorker.emit({
        text: model.getValue(),
        language: model.getLanguageId(),
      });
      if (canceled || error) return [];
      return [
        {
          range: model.getFullModelRange(),
          text: pretty,
        },
      ];
    },
  };

  // override the built-in HTML formatter
  const _registerDocumentFormattingEditProvider =
    monaco.languages.registerDocumentFormattingEditProvider;
  monaco.languages.registerDocumentFormattingEditProvider = (id, provider) => {
    if (id !== "html") {
      return _registerDocumentFormattingEditProvider(id, provider);
    }
    return _registerDocumentFormattingEditProvider(
      "html",
      formattingEditProvider
    );
  };
  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      "markdown",
      formattingEditProvider
    )
  );
  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      "css",
      formattingEditProvider
    )
  );
  disposables.push(
    monaco.languages.registerDocumentFormattingEditProvider(
      "javascript",
      formattingEditProvider
    )
  );

  return {
    dispose() {
      disposables.forEach((disposable) => disposable.dispose());
      if (prettierWorker) {
        prettierWorker.terminate();
      }
    },
  };
}
