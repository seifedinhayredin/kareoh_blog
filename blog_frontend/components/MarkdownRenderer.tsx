"use client";

import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";


interface MarkdownRendererProps {
  content: string;
}


// =====================================
// CODE BLOCK
// =====================================

interface CodeBlockProps {
  code: string;
  language: string;
}


function CodeBlock({
  code,
  language,
}: CodeBlockProps) {

  const [copied, setCopied] =
    useState(false);


  async function handleCopy() {

    try {

      await navigator.clipboard.writeText(
        code
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {

      console.error(
        "Failed to copy code:",
        error
      );

    }
  }


  return (

    <div className="my-6 overflow-hidden rounded-xl border border-gray-700 bg-gray-900">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">

        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {language}
        </span>


        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>

      </div>


      {/* =========================
          CODE
      ========================= */}

      <div className="overflow-x-auto">

        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.7",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "var(--font-geist-mono), monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>

      </div>

    </div>
  );
}


// =====================================
// MARKDOWN RENDERER
// =====================================

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {

  return (

    <article className="prose prose-lg max-w-none">

      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
        ]}
        rehypePlugins={[
          rehypeKatex,
        ]}
        components={{

          // =================================
          // CODE
          // =================================

          code({
            className,
            children,
            ...props
          }) {

            const match =
              /language-(\w+)/.exec(
                className || ""
              );

            const code =
              String(children).replace(
                /\n$/,
                ""
              );


            // =================================
            // CODE BLOCK
            // =================================

            if (match) {

              return (
                <CodeBlock
                  code={code}
                  language={match[1]}
                />
              );
            }


            // =================================
            // INLINE CODE
            // =================================

            return (

              <code
                className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800"
                {...props}
              >
                {children}
              </code>

            );
          },


          // =================================
          // PRE
          // =================================

          pre({
            children,
          }) {

            return (
              <>
                {children}
              </>
            );
          },

        }}
      >

        {content}

      </ReactMarkdown>

    </article>
  );
}