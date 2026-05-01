import { useState, useRef } from "react";
import { Sparkles, Search, X, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string | number;
  name: string;
  price?: number;
  image?: string;
  category?: string;
  bestseller?: boolean;
  [key: string]: unknown;
}

interface MoodSearchProps {
  products: Product[];
}

const MOOD_CHIPS = [
  "I feel grateful",
  "someone's birthday",
  "cozy night in",
  "celebrate a win",
  "thinking of you",
  "self-care Sunday",
];

export const MoodSearch = ({ products }: MoodSearchProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [aiMessage, setAiMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (feeling: string) => {
    if (!feeling.trim()) return;
    setQuery(feeling);
    setLoading(true);
    setHasSearched(false);
    setResults([]);
    setAiMessage("");

    try {
      const catalogue = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category ?? "gift",
        bestseller: p.bestseller ?? false,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a thoughtful gift curator for a small luxury gift studio.
A shopper wrote: "${feeling}"

Product catalogue (JSON):
${JSON.stringify(catalogue)}

Return ONLY valid JSON (no markdown, no preamble) with this exact shape:
{
  "message": "One warm, 1–2 sentence note to the shopper about why these gifts suit their feeling. Sound human, poetic, and sincere.",
  "productIds": [array of 1–4 product id values that best match the feeling]
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content
        ?.map((b: { type: string; text?: string }) =>
          b.type === "text" ? b.text : ""
        )
        .join("");

      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const matched = parsed.productIds
        .map((id: string | number) =>
          products.find((p) => String(p.id) === String(id))
        )
        .filter(Boolean) as Product[];

      setAiMessage(parsed.message ?? "");
      setResults(matched);
    } catch {
      setAiMessage("Couldn't find suggestions right now. Try browsing the full collection.");
      setResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setAiMessage("");
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <>
      {/*
        ── FLOATING CARD ──────────────────────────────────────────────────────
        Rendered inside a `absolute bottom-0 left-0 right-0` wrapper in Index.tsx.
        The card itself is centered with mx-auto and has its own max-width.
      */}
      <div className="mood-float-card">
        {/* Eyebrow label */}
        <div className="mood-eyebrow">
          <Sparkles className="mood-eyebrow-icon" />
          <span>AI gift finder</span>
        </div>

        {/* Search input */}
        <div className={`mood-input-wrap ${isFocused ? "focused" : ""}`}>
          <Search className="mood-input-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe a feeling, occasion, or person…"
            className="mood-input"
          />
          {query && (
            <button onClick={clearSearch} className="mood-clear-btn" aria-label="Clear">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => handleSearch(query)}
            className="mood-search-btn"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="mood-search-label">Find gifts</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Mood chips */}
        {!hasSearched && !loading && (
          <div className="mood-chips">
            {MOOD_CHIPS.map((chip) => (
              <button key={chip} className="mood-chip" onClick={() => handleSearch(chip)}>
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/*
        ── RESULTS PANEL ──────────────────────────────────────────────────────
        Flows in normal document order, rendered AFTER the hero in Index.tsx.
        Zero height when empty so it doesn't affect layout.
      */}
      {(loading || hasSearched) && (
        <div className="mood-results-section">
          <div className="container">
            {loading && (
              <div className="mood-skeleton-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mood-skeleton-card">
                    <div className="mood-skeleton-img" />
                    <div className="mood-skeleton-line wide" />
                    <div className="mood-skeleton-line narrow" />
                  </div>
                ))}
              </div>
            )}

            {hasSearched && !loading && (
              <>
                {aiMessage && (
                  <div className="mood-ai-message">
                    <Sparkles className="mood-ai-icon" />
                    <p>{aiMessage}</p>
                  </div>
                )}
                {results.length > 0 ? (
                  <div className="mood-results-grid">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="mood-product-card"
                      >
                        {product.image ? (
                          <img
                            src={product.image as string}
                            alt={product.name}
                            className="mood-product-img"
                          />
                        ) : (
                          <div className="mood-product-img-placeholder" />
                        )}
                        <div className="mood-product-info">
                          <span className="mood-product-name">{product.name}</span>
                          {product.price !== undefined && (
                            <span className="mood-product-price">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="mood-bestseller-badge">Bestseller</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mood-no-results">
                    No exact match — try a different feeling or{" "}
                    <Link to="/products" className="mood-browse-link">
                      browse all products
                    </Link>.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* ── Floating glass card ────────────────────────────────────────────── */
        .mood-float-card {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background: hsl(var(--background) / 0.78);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border: 1px solid hsl(var(--border) / 0.65);
          border-radius: 1.5rem;
          padding: 1.1rem 1.4rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          box-shadow:
            0 16px 48px hsl(0 0% 0% / 0.14),
            0 4px 12px hsl(0 0% 0% / 0.08),
            inset 0 1px 0 hsl(var(--background) / 0.55);
        }

        /* ── Eyebrow ── */
        .mood-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.66rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: hsl(var(--primary));
        }
        .mood-eyebrow-icon { width: 11px; height: 11px; }

        /* ── Input row ── */
        .mood-input-wrap {
          display: flex;
          align-items: center;
          border-radius: 9999px;
          border: 1.5px solid hsl(var(--border));
          background: hsl(var(--background));
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .mood-input-wrap.focused {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
        }
        .mood-input-icon {
          width: 15px; height: 15px;
          margin-left: 1rem;
          color: hsl(var(--muted-foreground));
          flex-shrink: 0;
        }
        .mood-input {
          flex: 1;
          border: none; outline: none;
          background: transparent;
          padding: 0.78rem 0.6rem;
          font-size: 0.88rem;
          color: hsl(var(--foreground));
          font-family: inherit;
        }
        .mood-input::placeholder { color: hsl(var(--muted-foreground) / 0.5); }
        .mood-clear-btn {
          border: none; background: transparent; cursor: pointer;
          padding: 0.4rem;
          color: hsl(var(--muted-foreground));
          display: flex; align-items: center;
          border-radius: 50%;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .mood-clear-btn:hover { background: hsl(var(--muted) / 0.5); }
        .mood-search-btn {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          padding: 0 1rem;
          min-height: 42px;
          border: none;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          cursor: pointer;
          transition: opacity 0.15s;
          flex-shrink: 0;
          font-size: 0.82rem; font-weight: 500;
          font-family: inherit;
          white-space: nowrap;
        }
        .mood-search-btn:disabled { opacity: 0.38; cursor: default; }
        .mood-search-btn:not(:disabled):hover { opacity: 0.86; }
        .mood-search-label { display: none; }
        @media (min-width: 480px) { .mood-search-label { display: inline; } }

        /* ── Chips ── */
        .mood-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .mood-chip {
          padding: 3px 11px;
          border-radius: 9999px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background) / 0.5);
          color: hsl(var(--foreground) / 0.7);
          font-size: 0.73rem;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
          font-family: inherit;
        }
        .mood-chip:hover {
          background: hsl(var(--primary) / 0.08);
          border-color: hsl(var(--primary) / 0.35);
          color: hsl(var(--primary));
          transform: translateY(-1px);
        }

        /* ── Results section ── */
        .mood-results-section { padding: 2.5rem 0 0; }

        /* ── Skeleton ── */
        .mood-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          max-width: 720px; margin: 0 auto;
        }
        @media (max-width: 640px) { .mood-skeleton-grid { grid-template-columns: 1fr; } }
        .mood-skeleton-card {
          border-radius: 1rem;
          border: 1px solid hsl(var(--border));
          overflow: hidden;
          background: hsl(var(--card));
          padding-bottom: 1rem;
        }
        .mood-skeleton-img {
          height: 160px;
          background: linear-gradient(90deg,
            hsl(var(--muted)) 25%,
            hsl(var(--muted) / 0.5) 50%,
            hsl(var(--muted)) 75%
          );
          background-size: 200% 100%;
          animation: mood-shimmer 1.4s infinite;
        }
        .mood-skeleton-line {
          height: 11px; border-radius: 6px;
          background: hsl(var(--muted));
          margin: 0.75rem auto 0;
          animation: mood-shimmer 1.4s infinite;
        }
        .mood-skeleton-line.wide  { width: 68%; }
        .mood-skeleton-line.narrow{ width: 38%; margin-top: 0.4rem; }
        @keyframes mood-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── AI message ── */
        .mood-ai-message {
          display: flex; align-items: flex-start; gap: 10px;
          background: hsl(var(--primary) / 0.07);
          border: 1px solid hsl(var(--primary) / 0.18);
          border-radius: 1rem;
          padding: 0.9rem 1.2rem;
          margin-bottom: 1.5rem;
          max-width: 720px; margin-left: auto; margin-right: auto;
        }
        .mood-ai-icon { width: 15px; height: 15px; color: hsl(var(--primary)); flex-shrink: 0; margin-top: 3px; }
        .mood-ai-message p { font-size: 0.92rem; color: hsl(var(--foreground)); line-height: 1.6; margin: 0; }

        /* ── Product grid ── */
        .mood-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
          gap: 1rem;
          max-width: 760px; margin: 0 auto;
        }
        .mood-product-card {
          display: flex; flex-direction: column;
          border-radius: 1rem;
          border: 1px solid hsl(var(--border));
          overflow: hidden;
          background: hsl(var(--card));
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .mood-product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px hsl(var(--foreground) / 0.08);
        }
        .mood-product-img { width: 100%; height: 160px; object-fit: cover; }
        .mood-product-img-placeholder { width: 100%; height: 160px; background: hsl(var(--muted)); }
        .mood-product-info { padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 4px; }
        .mood-product-name { font-size: 0.87rem; font-weight: 500; color: hsl(var(--foreground)); line-height: 1.35; }
        .mood-product-price { font-size: 0.81rem; color: hsl(var(--muted-foreground)); }
        .mood-bestseller-badge {
          display: inline-block;
          font-size: 0.67rem; font-weight: 500; letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 9999px;
          background: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
          width: fit-content; margin-top: 2px;
        }

        /* ── No results ── */
        .mood-no-results { font-size: 0.92rem; color: hsl(var(--muted-foreground)); text-align: center; padding: 2rem 0; }
        .mood-browse-link { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
    </>
  );
};

export default MoodSearch;