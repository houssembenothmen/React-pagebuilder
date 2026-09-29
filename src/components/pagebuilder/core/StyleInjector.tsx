"use client";

import { useEffect, useState } from "react";
import { componentRegistry } from "./registry";

const StyleInjector = () => {
    const [, forceUpdate] = useState(0);

    useEffect(() => componentRegistry.subscribe(() => forceUpdate((n) => n + 1)), []);

    return <style id="pb-component-styles">{componentRegistry.allCss()}</style>;
};

export default StyleInjector;