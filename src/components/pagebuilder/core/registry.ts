import type { ComponentDefinition } from "./types";

const eraseDefinition = <P,>(def: ComponentDefinition<P>): ComponentDefinition =>
    def as unknown as ComponentDefinition;

class ComponentRegistry {
    private defs = new Map<string, ComponentDefinition>();
    private listeners = new Set<() => void>();

    register = <P,>(def: ComponentDefinition<P>) => {
        if (!def) {
            console.error(`[page-builder] register() called with an undefined/null definition.`);
            return;
        }
        if (!def.icon) {
            console.error(`[page-builder] Component "${def.title ?? "(no title)"}" is missing an icon.`, def);
        }
        if (!def.title) {
            console.error(`[page-builder] Component definition is missing a title:`, def);
        }

        const erased = eraseDefinition(def);
        if (this.defs.has(erased.title)) {
            console.warn(`[page-builder] "${erased.title}" is already registered — overwriting.`);
        }
        this.defs.set(erased.title, erased);
        this.listeners.forEach((l) => l());
    };

    registerAll = <P,>(defs: ComponentDefinition<P>[]) =>
        defs.forEach((d, i) => {
            if (!d) {
                console.error(`[page-builder] registerAll() received an undefined/null definition at index ${i}.`);
                return;
            }
            this.register(d);
        });

    unregister = (title: string) => {
        this.defs.delete(title);
        this.listeners.forEach((l) => l());
    };

    get = (title: string): ComponentDefinition | undefined => this.defs.get(title);

    getAll = (): ComponentDefinition[] => [...this.defs.values()];

    getByGroup = (): { group: string; groupLabelKey?: string; items: ComponentDefinition[] }[] => {
        const order: string[] = [];
        const map = new Map<string, ComponentDefinition[]>();
        for (const def of this.defs.values()) {
            if (!map.has(def.group)) {
                map.set(def.group, []);
                order.push(def.group);
            }
            map.get(def.group)!.push(def);
        }
        return order.map((group) => ({
            group,
            groupLabelKey: map.get(group)![0].groupLabelKey,
            items: map.get(group)!,
        }));
    };

    /** Returns a void unsubscribe fn — safe to use directly as a useEffect destructor. */
    subscribe = (listener: () => void): (() => void) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };

    allCss = (): string => [...this.defs.values()].map((d) => d.css ?? "").join("\n");
}

export const componentRegistry = new ComponentRegistry();
export const registerComponent = componentRegistry.register;
export const registerComponents = componentRegistry.registerAll;