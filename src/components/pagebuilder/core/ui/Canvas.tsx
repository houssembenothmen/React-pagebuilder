"use client";

import type { CSSProperties } from "react";
import DropZone from "../render/DropZone";
import { usePageBuilder } from "../context/PageBuilderContext";
import { PAGE_ROOT_ID, computePageStyles, type PageProps } from "../page";

const Canvas = () => {
    const { canvasItems, page, selectedId, selectComponent } = usePageBuilder();
    const { frame, flow } = computePageStyles(page.props as PageProps, page.layout);

    return (
        <div className="pb-canvas" onClick={() => selectComponent(PAGE_ROOT_ID)}>
            <div
                className={`pb-page-root${selectedId === PAGE_ROOT_ID ? " selected" : ""}`}
                style={frame as CSSProperties}
                onClick={(e) => { e.stopPropagation(); selectComponent(PAGE_ROOT_ID); }}
            >
                <span className="pb-page-root-label">Page</span>
                <DropZone parentId={null} items={canvasItems} empty style={flow as CSSProperties} />
            </div>
        </div>
    );
};

export default Canvas;