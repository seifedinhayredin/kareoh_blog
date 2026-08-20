"use client";

import { useRef, useState } from "react";

import MarkdownRenderer from "@/components/MarkdownRenderer";


interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type Mode = "edit" | "preview" | "split";


const CODE_LANGUAGES = [
  { label: "Plain Text", value: "text" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "SQL", value: "sql" },
  { label: "Bash", value: "bash" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
];


export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const [mode, setMode] =
    useState<Mode>("split");

  const [showLanguages, setShowLanguages] =
    useState(false);


  // =========================
  // INSERT TEXT
  // =========================

  function insertText(
    before: string,
    after: string = ""
  ) {

    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const selectedText =
      value.substring(start, end);

    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    requestAnimationFrame(() => {

      textarea.focus();

      const cursorPosition =
        start +
        before.length +
        selectedText.length +
        after.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );

    });
  }


  // =========================
  // INSERT BLOCK
  // =========================

  function insertBlock(
  text: string,
  cursorOffset?: number
) {
  const textarea =
    textareaRef.current;

  if (!textarea) {
    return;
  }

  const start =
    textarea.selectionStart;

  const end =
    textarea.selectionEnd;

  const selectedText =
    value.substring(start, end);

  const insertedText =
    text.replace(
      "{{text}}",
      selectedText
    );

  const newText =
    value.substring(0, start) +
    insertedText +
    value.substring(end);

  onChange(newText);

  requestAnimationFrame(() => {
    textarea.focus();

    if (cursorOffset !== undefined) {
      const cursorPosition =
        start + cursorOffset;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    } else {
      const cursorPosition =
        start + insertedText.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    }
  });
}


  // =========================
  // INSERT CODE BLOCK
  // =========================

  function insertCodeBlock(
  language: string
) {
  const codeBlock =
    `\`\`\`${language}\n{{text}}\n\`\`\``;

  const cursorPosition =
    codeBlock.indexOf("{{text}}");

  insertBlock(
    codeBlock,
    cursorPosition
  );

  setShowLanguages(false);
}


  return (

    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 p-2">

        {/* BOLD */}

        <button
          type="button"
          onClick={() =>
            insertText("**", "**")
          }
          title="Bold"
          className="rounded px-3 py-2 font-bold hover:bg-gray-200"
        >
          B
        </button>


        {/* ITALIC */}

        <button
          type="button"
          onClick={() =>
            insertText("*", "*")
          }
          title="Italic"
          className="rounded px-3 py-2 italic hover:bg-gray-200"
        >
          I
        </button>


        {/* H1 */}

        <button
          type="button"
          onClick={() =>
            insertBlock("# {{text}}")
          }
          title="Heading 1"
          className="rounded px-3 py-2 font-bold hover:bg-gray-200"
        >
          H1
        </button>


        {/* H2 */}

        <button
          type="button"
          onClick={() =>
            insertBlock("## {{text}}")
          }
          title="Heading 2"
          className="rounded px-3 py-2 font-bold hover:bg-gray-200"
        >
          H2
        </button>


        {/* BULLET */}

        <button
          type="button"
          onClick={() =>
            insertBlock("- {{text}}")
          }
          title="Bullet list"
          className="rounded px-3 py-2 hover:bg-gray-200"
        >
          • List
        </button>


        {/* NUMBERED */}

        <button
          type="button"
          onClick={() =>
            insertBlock("1. {{text}}")
          }
          title="Numbered list"
          className="rounded px-3 py-2 hover:bg-gray-200"
        >
          1. List
        </button>


        {/* INLINE CODE */}

        <button
          type="button"
          onClick={() =>
            insertText("`", "`")
          }
          title="Inline code"
          className="rounded px-3 py-2 font-mono hover:bg-gray-200"
        >
          {"</>"}
        </button>


        {/* =========================
            CODE BUTTON
        ========================= */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowLanguages(
                (current) => !current
              )
            }
            title="Code block"
            className="rounded px-3 py-2 font-mono hover:bg-gray-200"
          >
            Code ▾
          </button>


          {showLanguages && (

            <div className="absolute left-0 top-full z-50 mt-1 max-h-72 w-48 overflow-y-auto rounded-lg border bg-white p-1 shadow-lg">

              {CODE_LANGUAGES.map(
                (language) => (

                  <button
                    key={language.value}
                    type="button"
                    onClick={() =>
                      insertCodeBlock(
                        language.value
                      )
                    }
                    className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {language.label}
                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* QUOTE */}

        <button
          type="button"
          onClick={() =>
            insertBlock("> {{text}}")
          }
          title="Quote"
          className="rounded px-3 py-2 hover:bg-gray-200"
        >
          Quote
        </button>


        {/* EQUATION */}

        <button
  type="button"
  onClick={() => {
    const equation =
      "$$\n{{text}}\n$$";

    insertBlock(
      equation,
      equation.indexOf("{{text}}")
    );
  }}
  title="Equation"
  className="rounded px-3 py-2 hover:bg-gray-200"
>
  Σ
</button>


        <div className="hidden flex-1 sm:block" />


        {/* =========================
            VIEW MODE
        ========================= */}

        <div className="flex overflow-hidden rounded-lg border bg-white">

          <button
            type="button"
            onClick={() =>
              setMode("edit")
            }
            className={`px-3 py-2 text-sm ${
              mode === "edit"
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              setMode("split")
            }
            className={`border-x px-3 py-2 text-sm ${
              mode === "split"
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            Split
          </button>

          <button
            type="button"
            onClick={() =>
              setMode("preview")
            }
            className={`px-3 py-2 text-sm ${
              mode === "preview"
                ? "bg-gray-200 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            Preview
          </button>

        </div>

      </div>


      {/* =========================
          EDITOR / PREVIEW
      ========================= */}

      <div
        className={
          mode === "split"
            ? "grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0"
            : ""
        }
      >

        {/* EDIT */}

        {(mode === "edit" ||
          mode === "split") && (

          <div>

            {mode === "split" && (

              <div className="border-b bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Editor
              </div>

            )}

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) =>
                onChange(
                  event.target.value
                )
              }
              placeholder="Write your post here..."
              className="min-h-[500px] w-full resize-y border-0 p-5 font-mono text-sm leading-7 outline-none"
            />

          </div>

        )}


        {/* PREVIEW */}

        {(mode === "preview" ||
          mode === "split") && (

          <div>

            {mode === "split" && (

              <div className="border-b bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Preview
              </div>

            )}

            <div className="min-h-[500px] overflow-y-auto p-5">

              {value.trim() ? (

                <MarkdownRenderer
                  content={value}
                />

              ) : (

                <p className="text-gray-400">
                  Nothing to preview yet.
                </p>

              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}