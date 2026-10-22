import { FAIRHELM_ORIGIN, blogUrl } from "@fairhelm/config/urls";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Block, Inline } from "@fairhelm/fairhelm-content/markdown";

/** Renders the Insights block tree with the house typography. */
function renderInline(nodes: Inline[]): ReactNode {
  return nodes.map((node, index) => {
    const key = `${node.type}-${index}`;
    switch (node.type) {
      case "text":
        return node.value;
      case "strong":
        return <strong key={key}>{renderInline(node.children)}</strong>;
      case "em":
        return <em key={key}>{renderInline(node.children)}</em>;
      case "code":
        return <code key={key}>{node.value}</code>;
      case "link":
        return /^https?:/.test(node.href) ? (
          <a
            key={key}
            href={
              node.href.startsWith("/insights/")
                ? blogUrl(node.href.replace("/insights/", "/fairhelm/"))
                : node.href.startsWith("/")
                  ? `${FAIRHELM_ORIGIN}${node.href}`
                  : node.href
            }
            rel="noopener"
          >
            {renderInline(node.children)}
          </a>
        ) : (
          <Link
            key={key}
            href={
              node.href.startsWith("/insights/")
                ? blogUrl(node.href.replace("/insights/", "/fairhelm/"))
                : node.href.startsWith("/")
                  ? `${FAIRHELM_ORIGIN}${node.href}`
                  : node.href
            }
          >
            {renderInline(node.children)}
          </Link>
        );
      default:
        return null;
    }
  });
}

export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-fh">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "heading":
            return block.depth === 2 ? (
              <h2 key={key} id={block.id}>
                {renderInline(block.children)}
              </h2>
            ) : (
              <h3 key={key} id={block.id}>
                {renderInline(block.children)}
              </h3>
            );
          case "paragraph":
            return <p key={key}>{renderInline(block.children)}</p>;
          case "list":
            return block.ordered ? (
              <ol key={key}>
                {block.items.map((item, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static article content, never reordered
                  <li key={`${key}-${i}`}>{renderInline(item)}</li>
                ))}
              </ol>
            ) : (
              <ul key={key}>
                {block.items.map((item, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static article content, never reordered
                  <li key={`${key}-${i}`}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={key}>
                <p>{renderInline(block.children)}</p>
              </blockquote>
            );
          case "table":
            return (
              <div key={key} className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {block.header.map((cell, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static article content, never reordered
                        <th key={`${key}-h${i}`}>{renderInline(cell)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static article content, never reordered
                      <tr key={`${key}-r${r}`}>
                        {row.map((cell, c) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static article content, never reordered
                          <td key={`${key}-r${r}c${c}`}>{renderInline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return (
              <pre key={key}>
                <code>{block.value}</code>
              </pre>
            );
          case "rule":
            return <hr key={key} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
