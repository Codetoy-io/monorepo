import Env from "$lib/components/Env/component.svelte"
import * as monaco from "monaco-editor"

function tagsToKind(tags: string[]): number {
  const K = monaco.languages.CompletionItemKind;
  for (const tag of tags) {
    switch (tag) {
      case "Class":
        return K.Class;
      case "Method":
      case "ExtensionMethod":
        return K.Method;
      case "Property":
        return K.Property;
      case "Field":
        return K.Field;
      case "Interface":
        return K.Interface;
      case "Enum":
        return K.Enum;
      case "EnumMember":
        return K.EnumMember;
      case "Namespace":
        return K.Module;
      case "Keyword":
        return K.Keyword;
      case "Local":
      case "Parameter":
      case "RangeVariable":
        return K.Variable;
      case "Structure":
        return K.Struct;
      case "Event":
        return K.Event;
      case "Delegate":
        return K.Function;
      case "Snippet":
        return K.Snippet;
      case "Constant":
        return K.Constant;
    }
  }
  return K.Text;
}

export function getCompletionsProvider(env: string, iframe: () => Env | undefined) {
  // TODO handle Completions provider for Luau and Python
  if (env === "as") return undefined;
  else if (env === "lua") return undefined;
  else return async function provideCompletionItems(model:any, position:any) {
    const charBefore = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: Math.max(1, position.column - 1),
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });
    if ([";", "{", "}"].includes(charBefore)) return { suggestions: [] };

    const offset = model.getOffsetAt(position);
    const items = await iframe()!.getCompletions(offset, model.getValue());

    if (!items?.length) return { suggestions: [] };

    return {
      suggestions: items.map((item: any) => {
        const start = model.getPositionAt(item.span.start);
        const end = model.getPositionAt(item.span.end);
        return {
          label: {
            label: item.displayText,
            description: item.inlineDescription,
          },
          kind: tagsToKind(item.tags),
          insertText: item.displayText,
          filterText: item.filterText,
          sortText: item.sortText,
          range: {
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
          },
        };
      }),
    };
  }

}