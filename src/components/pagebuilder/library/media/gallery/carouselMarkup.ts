export type ImageData = { src: string; alt: string };

const MAIN_ASPECT = "16 / 6";
const THUMB_ASPECT = "5 / 3";

function escapeAttr(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Builds a self-contained pure HTML/CSS radio-driven carousel (main viewport
 * + synced sliding thumbnail strip, no JS) for an arbitrary list of images.
 * Every id/class is namespaced with `uid` so multiple carousels can coexist
 * on the same page.
 */
export function buildAlbumCarouselMarkup(images: ImageData[], uid: string): { styleTag: string; bodyHtml: string } {
    const n = images.length;
    if (n === 0) return { styleTag: "", bodyHtml: "" };

    const visibleBase = Math.min(5, n);
    const visibleSm = Math.min(3, n);
    const visibleXs = Math.min(2, n);
    const showNav = n > 1;

    const cls = (name: string) => `${uid}-${name}`;
    const slideId = (i: number) => `${uid}-s${i}`;

    const radios = images
        .map((_, i) => {
            const idx = i + 1;
            return `<input type="radio" name="${uid}-slide" id="${slideId(idx)}" class="${cls("radio")}"${idx === 1 ? " checked" : ""}>`;
        })
        .join("\n");

    const mainSlides = images
        .map((img, i) => `<figure class="${cls("main-slide")}"><img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt || `Slide ${i + 1}`)}"></figure>`)
        .join("\n");

    const navArrows = showNav
        ? images
              .map((_, i) => {
                  const idx = i + 1;
                  const prevIdx = idx === 1 ? n : idx - 1;
                  const nextIdx = idx === n ? 1 : idx + 1;
                  return `<label class="${cls("main-nav")} ${cls("main-nav--prev")} ${cls(`main-nav--prev-${idx}`)}" for="${slideId(prevIdx)}">&#10094;</label>
<label class="${cls("main-nav")} ${cls("main-nav--next")} ${cls(`main-nav--next-${idx}`)}" for="${slideId(nextIdx)}">&#10095;</label>`;
              })
              .join("\n")
        : "";

    const counters = showNav
        ? images.map((_, i) => { const idx = i + 1; return `<span class="${cls("main-counter")} ${cls(`main-counter--${idx}`)}">${idx} / ${n}</span>`; }).join("\n")
        : "";

    const thumbs = showNav
        ? images.map((img, i) => { const idx = i + 1; return `<label class="${cls("thumbs-thumb")}" for="${slideId(idx)}"><img src="${escapeAttr(img.src)}" alt="Go to slide ${idx}"></label>`; }).join("\n")
        : "";

    const bodyHtml = `<div class="${cls("carousel")}" style="--n:${n};">
${radios}
  <div class="${cls("main")}">
    <div class="${cls("main-track")}">
      ${mainSlides}
    </div>
    ${navArrows}
    ${counters}
  </div>
  ${showNav ? `<div class="${cls("thumbs")}">
    <div class="${cls("thumbs-track")}">
      ${thumbs}
    </div>
  </div>` : ""}
</div>`;

    const perSlideMainCSS = images
        .map((_, i) => `#${slideId(i + 1)}:checked ~ .${cls("main")} .${cls("main-track")} { transform: translateX(calc(-${i} * (100% / var(--n)))); }`)
        .join("\n");

    const perSlideThumbTrackCSS = showNav
        ? images.map((_, i) => { const idx = i + 1; return `#${slideId(idx)}:checked ~ .${cls("thumbs")} .${cls("thumbs-track")} { transform: translateX(calc(min(0%, (var(--visible) - ${idx}) * (100% / var(--n))))); }`; }).join("\n")
        : "";

    const thumbHighlightSelector = showNav
        ? images.map((_, i) => { const idx = i + 1; return `#${slideId(idx)}:checked ~ .${cls("thumbs")} label[for="${slideId(idx)}"] img`; }).join(",\n")
        : "";

    const navCounterSelector = showNav
        ? images.map((_, i) => {
              const idx = i + 1;
              return `#${slideId(idx)}:checked ~ .${cls("main")} .${cls(`main-nav--prev-${idx}`)}, #${slideId(idx)}:checked ~ .${cls("main")} .${cls(`main-nav--next-${idx}`)}, #${slideId(idx)}:checked ~ .${cls("main")} .${cls(`main-counter--${idx}`)}`;
          }).join(",\n")
        : "";

    const styleTag = `<style>
.${cls("carousel")} {
  --visible: ${visibleBase};
  width: 100%; margin: 0 auto; background: #1a1d24; border-radius: 16px; padding: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,.35); box-sizing: border-box;
  font-family: system-ui, "Segoe UI", Arial, sans-serif; display: flex; flex-direction: column;
}
.${cls("carousel")} *, .${cls("carousel")} *::before, .${cls("carousel")} *::after { box-sizing: border-box; }
@media (max-width: 640px) { .${cls("carousel")} { --visible: ${visibleSm}; } }
@media (max-width: 420px) { .${cls("carousel")} { --visible: ${visibleXs}; } }
.${cls("radio")} { display: none; }
.${cls("main")} { position: relative; overflow: hidden; border-radius: 12px; aspect-ratio: ${MAIN_ASPECT}; }
.${cls("main-track")} { position: absolute; top: 0; height: 100%; display: flex; width: calc(var(--n) * 100%); transition: transform .6s cubic-bezier(.65,0,.35,1); }
.${cls("main-slide")} { height: 100%; width: calc(100% / var(--n)); margin: 0; flex: none; display: flex; justify-content: center; align-items: center; background-color: #000; }
.${cls("main-slide")} img { max-width: 100%; max-height: 100%; object-fit: cover; display: block; user-select: none; }
.${cls("main-nav")} { position: absolute; top: 50%; translate: 0 -50%; width: 42px; height: 42px; border-radius: 50%; background: rgba(0,0,0,.45); color: #fff; display: none; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; backdrop-filter: blur(3px); transition: background .2s ease; z-index: 2; }
.${cls("main-nav")}:hover { background: rgba(0,0,0,.7); }
.${cls("main-nav--prev")} { left: 12px; }
.${cls("main-nav--next")} { right: 12px; }
.${cls("main-counter")} { position: absolute; right: 14px; bottom: 14px; padding: 4px 10px; border-radius: 999px; background: rgba(0,0,0,.5); color: #fff; font-size: 12px; letter-spacing: .5px; display: none; z-index: 2; }
.${cls("thumbs")} { overflow: hidden; margin-top: 12px; border-radius: 10px; display: flex; }
.${cls("thumbs-track")} { display: flex; width: calc(var(--n) / var(--visible) * 100%); transition: transform .6s cubic-bezier(.65,0,.35,1); }
.${cls("thumbs-thumb")} { flex: none; width: calc(100% / var(--n)); aspect-ratio: ${THUMB_ASPECT}; padding: 4px; cursor: pointer; max-width: 10rem; }
.${cls("thumbs-thumb")} img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px; border: 3px solid transparent; opacity: .55; transition: border-color .25s ease, opacity .25s ease, transform .25s ease; }
.${cls("thumbs-thumb")}:hover img { opacity: .85; }
${perSlideMainCSS}
${perSlideThumbTrackCSS}
${showNav ? `${thumbHighlightSelector} { opacity: 1; border-color: #6ea8fe; transform: scale(1.04); }` : ""}
${showNav ? `${navCounterSelector} { display: flex; }` : ""}
</style>`;

    return { styleTag, bodyHtml };
}