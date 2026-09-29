import React, { useEffect, useState, CSSProperties } from "react";

// Some bundlers (Next.js in particular) turn `import x from "./x.svg"`
// into a StaticImageData-like object ({ src, width, height, ... })
// instead of a plain URL string. Accept both so this component isn't
// coupled to one bundler's behavior.
type IconSource = string | { src: string };

interface IconProps {
    /** URL/path to the .svg file, or the object your bundler produces for it */
    src: IconSource;
    size?: number;
    className?: string;
    style?: CSSProperties;
}

function resolveSrc(src: IconSource): string {
    return typeof src === "string" ? src : src.src;
}

// Module-level cache so the same icon's text is only fetched once, no
// matter how many <Icon> instances reference it across the app.
const svgTextCache = new Map<string, string>();

/**
 * Strips hardcoded width/height and forces fill/stroke to `currentColor`
 * (unless explicitly "none"), so the icon inherits color from CSS just
 * like a font icon would.
 */
function sanitizeSvg(raw: string, size: number): string {
    let svg = raw.trim();

    // Remove XML prolog / doctype some SVG exporters include
    svg = svg.replace(/<\?xml[^>]*\?>/, "");
    svg = svg.replace(/<!DOCTYPE[^>]*>/, "");

    const svgTagMatch = svg.match(/<svg[^>]*>/);
    const svgTag = svgTagMatch ? svgTagMatch[0] : "";

    const hasViewBox = /\bviewBox\s*=/.test(svgTag);
    const widthMatch = svgTag.match(/\bwidth="([\d.]+)"/);
    const heightMatch = svgTag.match(/\bheight="([\d.]+)"/);
    const origWidth = widthMatch?.[1];
    const origHeight = heightMatch?.[1];

    // Drop any existing width/height on the root <svg> so ours wins
    svg = svg.replace(/(<svg[^>]*)\swidth="[^"]*"/, "$1");
    svg = svg.replace(/(<svg[^>]*)\sheight="[^"]*"/, "$1");

    // If the source SVG has no viewBox, resizing width/height alone would
    // just crop the artwork to a tiny corner instead of scaling it down.
    // Derive a viewBox from its original dimensions to prevent that.
    if (!hasViewBox && origWidth && origHeight) {
        svg = svg.replace(
            "<svg",
            `<svg viewBox="0 0 ${origWidth} ${origHeight}"`
        );
    }

    svg = svg.replace("<svg", `<svg width="${size}" height="${size}"`);

    // Force currentColor so the icon can be styled via CSS `color`
    svg = svg.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
    svg = svg.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');

    return svg;
}

export function Icon({ src, size = 24, className = "", style }: IconProps) {
    const resolvedSrc = resolveSrc(src);
    const [rawSvg, setRawSvg] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const cached = svgTextCache.get(resolvedSrc);
        if (cached !== undefined) {
            // Already have it — sync state on the next microtask so this
            // doesn't count as a synchronous setState call inside the
            // effect body (react-hooks/set-state-in-effect).
            Promise.resolve().then(() => {
                if (isMounted) setRawSvg(cached);
            });
            return () => {
                isMounted = false;
            };
        }

        fetch(resolvedSrc)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        `Failed to load icon: ${resolvedSrc} (status ${res.status})`
                    );
                }
                return res.text();
            })
            .then((text) => {
                svgTextCache.set(resolvedSrc, text);
                if (isMounted) setRawSvg(text);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            isMounted = false;
        };
    }, [resolvedSrc]);

    // Strict null check on purpose: an empty string is a valid (if
    // unlikely) fetched value and must not be mistaken for "still loading".
    if (rawSvg === null) {
        return (
            <span
                className={`Icon Icon--loading ${className}`}
                style={{
                    display: "inline-block",
                    width: size,
                    height: size,
                    ...style,
                }}
            />
        );
    }

    return (
        <span
            className={`Icon ${className}`}
            style={{
                display: "inline-flex",
                width: size,
                height: size,
                lineHeight: 0,
                ...style,
            }}
            // Safe here: this only ever renders trusted, locally-bundled
            // SVG assets from your own /assets/icons folder, never
            // user-supplied content.
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(rawSvg, size) }}
        />
    );
}