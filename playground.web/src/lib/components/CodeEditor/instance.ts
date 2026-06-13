import * as monaco from "monaco-editor"

// Import the workers in a production-safe way.
// This is different than in Monaco's documentation for Vite,
// but avoids a weird error ("Unexpected usage") at runtime
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// I don't thing this does anything
// Lua syntax highlighting seems to work out of the box without it (although there is no intellisense)
// import { conf, language } from 'monaco-editor/esm/vs/basic-languages/lua/lua.js';
// monaco.languages.register({ id: 'lua' });
// monaco.languages.setMonarchTokensProvider('lua', language);
// monaco.languages.setLanguageConfiguration('lua', conf);

self.MonacoEnvironment = {
	getWorker: function (_: string, label: string) {
		switch (label) {
			case 'json':
				return new jsonWorker();
			case 'css':
			case 'scss':
			case 'less':
				return new cssWorker();
			case 'html':
			case 'handlebars':
			case 'razor':
				return new htmlWorker();
			case 'typescript':
			case 'javascript':
				return new tsWorker();
			default:
				return new editorWorker();
		}
	}
};

monaco!.editor.defineTheme("dark-theme", {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "string",  foreground: "CE9178" },
        { token: "keyword", foreground: "569CD6" },
        { token: "number",  foreground: "B5CEA8" },
        { token: "type",    foreground: "4EC9B0" },
    ],
    colors: {
        "editor.background":            "#191d29", // base-200/20 over base-100
        "editor.foreground":            "#ecf9ff",
        "editorLineNumber.foreground":  "#858585",
        "editor.selectionBackground":   "#264F78",
        "editor.lineHighlightBackground": "#161b27", // base-200
    },
});

monaco!.editor.defineTheme("light-theme", {
    base: "vs",
    inherit: true,
    rules: [
        { token: "comment", foreground: "008000" },
        { token: "string",  foreground: "A31515" },
        { token: "keyword", foreground: "0000FF" },
        { token: "number",  foreground: "098658" },
        { token: "type",    foreground: "267F99" },
    ],
    colors: {
        "editor.background":            "#ffffff",
        "editor.foreground":            "#18181b",
        "editorLineNumber.foreground":  "#6E7681",
        "editor.selectionBackground":   "#ADD6FF",
        "editor.lineHighlightBackground": "#F0F0F0",
    },
});

monaco!.editor.defineTheme("vscode-light-plus", {
    base: "vs",
    inherit: true,
    rules: [
        { token: "comment",                foreground: "6a9955" },
        { token: "prolog",                 foreground: "6a9955" },
        { token: "string",                 foreground: "ce9178" },
        { token: "string.escape",          foreground: "d7ba7d" },
        { token: "keyword",                foreground: "569CD6" },
        { token: "keyword.control",        foreground: "c586c0" },
        { token: "keyword.module",         foreground: "c586c0" },
        { token: "number",                 foreground: "b5cea8" },
        { token: "constant",               foreground: "9cdcfe" },
        { token: "boolean",                foreground: "569cd6" },
        { token: "type",                   foreground: "4ec9b0" },
        { token: "class",                  foreground: "4ec9b0" },
        { token: "type.identifier",        foreground: "4ec9b0" },
        { token: "identifier",             foreground: "deb917" },
        { token: "variable",               foreground: "9cdcfe" },
        { token: "variable.predefined",    foreground: "9cdcfe" },
        { token: "variable.parameter",     foreground: "9cdcfe" },
        { token: "property",               foreground: "9cdcfe" },
        { token: "parameter",              foreground: "9cdcfe" },
        { token: "operator",               foreground: "d4d4d4" },
        { token: "punctuation",            foreground: "a0a0a0" },
        { token: "delimiter",              foreground: "a0a0a0" },
        { token: "delimiter.bracket",      foreground: "a0a0a0" },
        { token: "delimiter.parenthesis",  foreground: "a0a0a0" },
        { token: "delimiter.curly",        foreground: "a0a0a0" },
        { token: "delimiter.square",       foreground: "a0a0a0" },
        { token: "tag",                    foreground: "569cd6" },
        { token: "tag.punctuation",        foreground: "808080" },
        { token: "attribute.name",         foreground: "9cdcfe" },
        { token: "attribute.value",        foreground: "ce9178" },
        { token: "selector",               foreground: "d7ba7d" },
        { token: "atrule",                 foreground: "c586c0" },
        { token: "unit",                   foreground: "b5cea8" },
        { token: "entity",                 foreground: "569cd6" },
        { token: "namespace",              foreground: "4ec9b0" },
        { token: "regex",                  foreground: "d16969" },
        { token: "important",              foreground: "569cd6" },
    ],
    colors: {
        "editor.background":                    "#00000000",
        "editor.foreground":                    "#3f3f42",
        "editorLineNumber.foreground":          "#858585",
        "editorLineNumber.activeForeground":    "#424242",
        "editorCursor.foreground":              "#000000",
        "editor.selectionBackground":           "#ADD6FF4D",
        "editor.inactiveSelectionBackground":   "#E5EBF1",
        "editor.lineHighlightBackground":       "#F0F0F080",
        "editor.findMatchBackground":           "#FFD33D66",
        "editor.findMatchHighlightBackground":  "#FFD33D33",
        "editor.findRangeHighlightBackground":  "#FFD33D1A",
        "editorIndentGuide.background":         "#D3D3D3",
        "editorIndentGuide.activeBackground":   "#939393",
        "editorWhitespace.foreground":          "#D3D3D3",
        "editorBracketHighlight.foreground1":   "#a0a0a0",
        "editorBracketHighlight.foreground2":   "#a0a0a0",
        "editorBracketHighlight.foreground3":   "#a0a0a0",
        "editorBracketHighlight.foreground4":   "#a0a0a0",
        "editorBracketHighlight.foreground5":   "#a0a0a0",
        "editorBracketHighlight.foreground6":   "#a0a0a0",
    },
});

monaco!.editor.defineTheme("vscode-dark-plus", {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "comment",                foreground: "6a9955" },
        { token: "prolog",                 foreground: "6a9955" },
        { token: "string",                 foreground: "ce9178" },
        { token: "string.escape",          foreground: "d7ba7d" },
        { token: "keyword",                foreground: "569CD6" },
        { token: "keyword.control",        foreground: "c586c0" },
        { token: "keyword.module",         foreground: "c586c0" },
        { token: "number",                 foreground: "b5cea8" },
        { token: "constant",               foreground: "9cdcfe" },
        { token: "boolean",                foreground: "569cd6" },
        { token: "type",                   foreground: "4ec9b0" },
        { token: "class",                  foreground: "4ec9b0" },
        { token: "type.identifier",        foreground: "4ec9b0" },
        { token: "identifier",             foreground: "dcdcaa" },
        { token: "variable",               foreground: "9cdcfe" },
        { token: "variable.predefined",    foreground: "9cdcfe" },
        { token: "variable.parameter",     foreground: "9cdcfe" },
        { token: "property",               foreground: "9cdcfe" },
        { token: "parameter",              foreground: "9cdcfe" },
        { token: "operator",               foreground: "d4d4d4" },
        { token: "punctuation",            foreground: "a0a0a0" },
        { token: "delimiter",              foreground: "a0a0a0" },
        { token: "delimiter.bracket",      foreground: "a0a0a0" },
        { token: "delimiter.parenthesis",  foreground: "a0a0a0" },
        { token: "delimiter.curly",        foreground: "a0a0a0" },
        { token: "delimiter.square",       foreground: "a0a0a0" },
        { token: "tag",                    foreground: "569cd6" },
        { token: "tag.punctuation",        foreground: "808080" },
        { token: "attribute.name",         foreground: "9cdcfe" },
        { token: "attribute.value",        foreground: "ce9178" },
        { token: "selector",               foreground: "d7ba7d" },
        { token: "atrule",                 foreground: "c586c0" },
        { token: "unit",                   foreground: "b5cea8" },
        { token: "entity",                 foreground: "569cd6" },
        { token: "namespace",              foreground: "4ec9b0" },
        { token: "regex",                  foreground: "d16969" },
        { token: "important",              foreground: "569cd6" },
    ],
    colors: {
        "editor.background":                    "#191d29", // base-200/20 over base-100
        "editor.foreground":                    "#d4d4d4",
        "editorLineNumber.foreground":          "#858585",
        "editorLineNumber.activeForeground":    "#c6c6c6",
        "editor.selectionBackground":           "#264F78",
        "editor.lineHighlightBackground":       "#161b2780", // base-200 at 50% opacity
        "editor.findMatchBackground":           "#FFD33D66",
        "editor.findMatchHighlightBackground":  "#FFD33D33",
        "editor.findRangeHighlightBackground":  "#FFD33D1A",
        "editorIndentGuide.background":         "#3E3E42",
        "editorIndentGuide.activeBackground":   "#707070",
        "editorWhitespace.foreground":          "#3E3E42",
        "editorBracketHighlight.foreground1":   "#a0a0a0",
        "editorBracketHighlight.foreground2":   "#a0a0a0",
        "editorBracketHighlight.foreground3":   "#a0a0a0",
        "editorBracketHighlight.foreground4":   "#a0a0a0",
        "editorBracketHighlight.foreground5":   "#a0a0a0",
        "editorBracketHighlight.foreground6":   "#a0a0a0",
    },
});

export default monaco;