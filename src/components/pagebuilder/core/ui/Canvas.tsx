"use client";

import DropZone from "../render/DropZone";
import { usePageBuilder } from "../context/PageBuilderContext";

const Canvas = () => {
    const { canvasItems, selectComponent } = usePageBuilder();
    return (
        <div className="pb-canvas" onClick={() => selectComponent(null)}>
            <DropZone parentId={null} items={canvasItems} empty />
        </div>
    );
};

export default Canvas;