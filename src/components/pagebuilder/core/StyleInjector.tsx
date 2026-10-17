// core/StyleInjector.tsx
"use client";

import { useEffect, useState } from "react";
import { componentRegistry } from "./registry";

const StyleInjector = () => {
    const [css, setCss] = useState("");

    useEffect(() => {
        const update = () => setCss(componentRegistry.allCss());
        update();
        return componentRegistry.subscribe(update);
    }, []);

    return <style id="pb-component-styles" suppressHydrationWarning>{css}</style>;
};

export default StyleInjector;