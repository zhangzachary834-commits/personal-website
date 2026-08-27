with open('/Users/zacharyzhang/Documents/personal-website/script.js', 'r') as f:
    text = f.read()

s_marker = 'function parseMarkdown(md) {'
e_marker = 'function escapeHtml(str)'

s_idx = text.find(s_marker)
e_idx = text.find(e_marker)

if s_idx != -1 and e_idx != -1:
    clean_fn = """function parseMarkdown(md) {
            if (!md) return "<p class='lead-text' style='color: var(--muted); font-style: italic;'>Start typing in the editor on the left to see your formatted essay live here.</p>";

            const NL = String.fromCharCode(10);
            let html = md;
            html = html.replace(/<span class=["']drop-cap["']>([\s\S]*?)<\/span>/gi, "___DROPCAP_$1___");
            html = html.replace(new RegExp("```([a-z]*)" + NL + "([\\s\\S]*?)```", "g"), (match, lang, code) => {
                return "<pre><code>" + escapeHtml(code.trim()) + "</code></pre>";
            });
            html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
            html = html.replace(/^#### (.*$)/gim, "<h5>$1</h5>");
            html = html.replace(/^### (.*$)/gim, "<h4>$1</h4>");
            html = html.replace(/^## (.*$)/gim, "<h3>$1</h3>");
            html = html.replace(/^# (.*$)/gim, "<h2>$1</h2>");
            html = html.replace(/^\> (.*$)/gim, "<blockquote><p>$1</p></blockquote>");
            html = html.replace(/^(?:---|[*]{3}|___)$/gim, "<hr class='essay-divider'>");
            html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
            html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
            html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="inline-link" target="_blank" rel="noopener noreferrer">$1</a>');
            html = html.replace(/___DROPCAP_([\s\S]*?)___/g, '<span class="drop-cap">$1</span>');

            const rawBlocks = html.split(NL + NL);
            const formattedBlocks = rawBlocks.map((block) => {
                block = block.trim();
                if (!block) return "";
                if (/^<(h[2-6]|blockquote|pre|hr)/i.test(block)) return block;

                if (block.startsWith("- ") || block.startsWith("* ")) {
                    const items = block.split(NL).map(line => line.replace(/^[-*]\s+/, "")).filter(Boolean);
                    return "<ul>" + items.map(it => "<li>" + it + "</li>").join("") + "</ul>";
                }

                if (/^\d+\.\s+/.test(block)) {
                    const items = block.split(NL).map(line => line.replace(/^\d+\.\s+/, "")).filter(Boolean);
                    return "<ol>" + items.map(it => "<li>" + it + "</li>").join("") + "</ol>";
                }

                return "<p>" + block.split(NL).join("<br>") + "</p>";
            });

            return formattedBlocks.join(NL + NL);
        }

        """
    new_text = text[:s_idx] + clean_fn + text[e_idx:]
    with open('/Users/zacharyzhang/Documents/personal-website/script.js', 'w') as f:
        f.write(new_text)
    print("parseMarkdown updated with String.fromCharCode(10)!")
