"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type {
    CanvasComponent,
    ComponentDefinition,
    LayoutStyle,
} from "../types";
import { componentRegistry } from "../registry";
import { buildExportHtml } from "../export/exportHtml";
import { createId } from "../ids";
import Section from "../../library/layout/section";
import Row from "../../library/layout/row";
import Column from "../../library/layout/column";
import Grid from "../../library/layout/grid";
import Container from "../../library/layout/container";
import Card from "../../library/layout/card";
import LayerStack from "../../library/layout/layer-stack";
import Divider from "../../library/layout/divider";
import Spacer from "../../library/layout/spacer";
import Heading from "../../library/typography/heading";
import Paragraph from "../../library/typography/paragraph";
import TextBlock from "../../library/typography/text-block";
import Quote from "../../library/typography/quote";
import RichText from "../../library/typography/rich-text";
import CodeBlock from "../../library/typography/code-block";
import Button from "../../library/typography/button";
import CtaBanner from "../../library/typography/cta-banner";
import Accordion from "../../library/content/accordion";
import Tabs from "../../library/content/tabs";
import List from "../../library/content/list";
import Table from "../../library/content/table";
import Timeline from "../../library/content/timeline";
import Badge from "../../library/content/badge";
import StarRating from "../../library/content/star-rating";
import Image from "../../library/media/image";
import Gallery from "../../library/media/gallery";
import Video from "../../library/media/video";
import Audio from "../../library/media/audio";
import PdfViewer from "../../library/media/pdf-viewer";
import Embed from "../../library/media/embed";
import MapEl from "../../library/media/map";
import Breadcrumbs from "../../library/navigation/breadcrumbs";
import HomeLink from "../../library/navigation/home-link";
import Anchor from "../../library/navigation/anchor";
import TextInput from "../../library/forms/text-input";
import Textarea from "../../library/forms/textarea";
import Navbar from "../../library/navigation/navbar";
import Checkbox from "../../library/forms/checkbox";
import Radio from "../../library/forms/radio";
import DatePicker from "../../library/forms/date-picker";
import Email from "../../library/forms/email";
import Phone from "../../library/forms/phone";
import Password from "../../library/forms/password";
import SubmitButton from "../../library/forms/submit-button";
import SocialIcons from "../../library/social/social-icons";
import TeamMembers from "../../library/social/team-members";
import Testimonial from "../../library/social/testimonial";
import LikeButton from "../../library/social/like-button";
import ProgressBar from "../../library/advanced/progress-bar";
import Chart from "../../library/advanced/chart";
import Modal from "../../library/advanced/modal";
import Tooltip from "../../library/advanced/tooltip";
import Countdown from "../../library/advanced/countdown";
import Slider from "../../library/advanced/slider";
import PricingTable from "../../library/advanced/pricing-table";
import ProductCard from "../../library/advanced/product-card";
import CartButton from "../../library/advanced/cart-button";
import Notification from "../../library/advanced/notification";
import { PAGE_ROOT_ID, createPageNode } from "../page";

interface PageBuilderContextValue {
    canvasItems: CanvasComponent[];
    selectedId: string | null;
    selectedComponent: CanvasComponent | null;
    selectedContainerForInsert: CanvasComponent | null;
    selectedInsertIndex: number | undefined;
    page: CanvasComponent;
    addComponent: (
        title: string,
        parentId?: string | null,
        index?: number,
    ) => void;
    removeComponent: (id: string) => void;
    moveComponent: (
        id: string,
        parentId: string | null,
        toIndex: number,
    ) => void;
    selectComponent: (id: string | null) => void;
    updateComponentProps: (id: string, props: Record<string, unknown>) => void;
    updateComponentLayout: (id: string, patch: Partial<LayoutStyle>) => void; // <-- add
    exportedHtml: string | null;
    exportAsHtml: () => string;
}

const rawLibrary = [
    Section,
    Row,
    Column,
    Grid,
    Container,
    Card,
    LayerStack,
    Divider,
    Spacer,
    Heading,
    Paragraph,
    TextBlock,
    RichText,
    Quote,
    CodeBlock,
    Button,
    CtaBanner,
    Accordion,
    Tabs,
    List,
    Table,
    Timeline,
    Badge,
    StarRating,
    Image,
    Gallery,
    Video,
    Audio,
    PdfViewer,
    Embed,
    MapEl,
    Navbar,
    Breadcrumbs,
    HomeLink,
    Anchor,
    TextInput,
    Textarea,
    Checkbox,
    Radio,
    DatePicker,
    Email,
    Phone,
    Password,
    SubmitButton,
    SocialIcons,
    TeamMembers,
    Testimonial,
    LikeButton,
    Slider,
    Countdown,
    Chart,
    ProgressBar,
    Modal,
    Tooltip,
    Notification,
    PricingTable,
    ProductCard,
    CartButton,
];

const PageBuilderContext = createContext<PageBuilderContextValue | null>(null);

const findNode = (
    nodes: CanvasComponent[],
    id: string,
): CanvasComponent | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

const locateParent = (
    nodes: CanvasComponent[],
    id: string,
    parentId: string | null = null,
): { parentId: string | null; index: number } | null => {
    const index = nodes.findIndex((n) => n.id === id);
    if (index !== -1) return { parentId, index };
    for (const node of nodes) {
        if (node.children) {
            const found = locateParent(node.children, id, node.id);
            if (found) return found;
        }
    }
    return null;
};

const insertNode = (
    nodes: CanvasComponent[],
    parentId: string | null,
    newNode: CanvasComponent,
    index?: number,
): CanvasComponent[] => {
    if (parentId === null) {
        const next = [...nodes];
        if (index === undefined || index >= next.length) next.push(newNode);
        else next.splice(index, 0, newNode);
        return next;
    }
    return nodes.map((node) => {
        if (node.id === parentId) {
            const children = node.children ? [...node.children] : [];
            if (index === undefined || index >= children.length)
                children.push(newNode);
            else children.splice(index, 0, newNode);
            return { ...node, children };
        }
        if (node.children) {
            return {
                ...node,
                children: insertNode(node.children, parentId, newNode, index),
            };
        }
        return node;
    });
};

const removeNode = (
    nodes: CanvasComponent[],
    id: string,
): { nodes: CanvasComponent[]; removed: CanvasComponent | null } => {
    let removed: CanvasComponent | null = null;
    const next = nodes.reduce<CanvasComponent[]>((acc, node) => {
        if (node.id === id) {
            removed = node;
            return acc;
        }
        if (node.children) {
            const result = removeNode(node.children, id);
            if (result.removed) removed = result.removed;
            acc.push({ ...node, children: result.nodes });
            return acc;
        }
        acc.push(node);
        return acc;
    }, []);
    return { nodes: next, removed };
};

const updateNode = (
    nodes: CanvasComponent[],
    id: string,
    patch: Record<string, unknown>,
): CanvasComponent[] =>
    nodes.map((node) => {
        if (node.id === id)
            return { ...node, props: { ...node.props, ...patch } };
        if (node.children)
            return { ...node, children: updateNode(node.children, id, patch) };
        return node;
    });

const isDescendant = (node: CanvasComponent, id: string): boolean => {
    if (!node.children) return false;
    return node.children.some(
        (child) => child.id === id || isDescendant(child, id),
    );
};

const updateLayout = (
    nodes: CanvasComponent[],
    id: string,
    patch: Partial<LayoutStyle>,
): CanvasComponent[] =>
    nodes.map((node) => {
        if (node.id === id)
            return { ...node, layout: { ...node.layout, ...patch } };
        if (node.children)
            return {
                ...node,
                children: updateLayout(node.children, id, patch),
            };
        return node;
    });

export const PageBuilderProvider = ({ children }: { children: ReactNode }) => {
    const [canvasItems, setCanvasItems] = useState<CanvasComponent[]>([]);
    const [exportedHtml, setExportedHtml] = useState<string | null>(null);

    const [page, setPage] = useState<CanvasComponent>(createPageNode);
    const [selectedId, setSelectedId] = useState<string | null>(PAGE_ROOT_ID);

    const addComponent = useCallback(
        (title: string, parentId: string | null = null, index?: number) => {
            const def = componentRegistry.get(title);
            if (!def) {
                console.warn(
                    `[page-builder] Cannot add unknown component "${title}"`,
                );
                return;
            }
            const newNode: CanvasComponent = {
                id: createId(),
                title,
                tag: def.tag,
                props: def.defaultProps(),
                children: def.isContainer ? [] : undefined,
            };
            setCanvasItems((prev) =>
                insertNode(prev, parentId, newNode, index),
            );
            setSelectedId(newNode.id);
        },
        [],
    );

    const updateComponentLayout = useCallback(
        (id: string, patch: Partial<LayoutStyle>) => {
            if (id === PAGE_ROOT_ID) {
                setPage((p) => ({ ...p, layout: { ...p.layout, ...patch } }));
                return;
            }
            setCanvasItems((prev) => updateLayout(prev, id, patch));
        },
        [],
    );

    const removeComponent = useCallback((id: string) => {
        if (id === PAGE_ROOT_ID) return; // the page can't be deleted
        setCanvasItems((prev) => removeNode(prev, id).nodes);
        setSelectedId((prev) => (prev === id ? PAGE_ROOT_ID : prev));
    }, []);

    const moveComponent = useCallback(
        (id: string, parentId: string | null, toIndex: number) => {
            setCanvasItems((prev) => {
                const moving = findNode(prev, id);
                if (!moving) return prev;
                if (
                    parentId &&
                    (parentId === id || isDescendant(moving, parentId))
                )
                    return prev;
                const { nodes: withoutMoved } = removeNode(prev, id);
                return insertNode(withoutMoved, parentId, moving, toIndex);
            });
        },
        [],
    );

    const updateComponentProps = useCallback(
        (id: string, props: Record<string, unknown>) => {
            if (id === PAGE_ROOT_ID) {
                setPage((p) => ({ ...p, props: { ...p.props, ...props } }));
                return;
            }
            setCanvasItems((prev) => updateNode(prev, id, props));
        },
        [],
    );

    const selectComponent = useCallback(
        (id: string | null) => setSelectedId(id),
        [],
    );

    const exportAsHtml = useCallback((): string => {
        const html = buildExportHtml(canvasItems, page);
        setExportedHtml(html);
        return html;
    }, [canvasItems, page]);

    const selectedComponent = useMemo(
        () =>
            selectedId === PAGE_ROOT_ID
                ? page
                : selectedId
                  ? findNode(canvasItems, selectedId)
                  : null,
        [canvasItems, selectedId, page],
    );

    const selectedParentInfo = useMemo(
        () => (selectedId ? locateParent(canvasItems, selectedId) : null),
        [canvasItems, selectedId],
    );

    const selectedContainerForInsert = useMemo<CanvasComponent | null>(() => {
        if (!selectedComponent) return null;
        const selfDef = componentRegistry.get(selectedComponent.title);
        if (selfDef?.isContainer) return selectedComponent;
        if (selectedParentInfo?.parentId)
            return findNode(canvasItems, selectedParentInfo.parentId);
        return null;
    }, [selectedComponent, selectedParentInfo, canvasItems]);

    const selectedInsertIndex = useMemo<number | undefined>(() => {
        if (!selectedComponent) return undefined;
        const selfDef = componentRegistry.get(selectedComponent.title);
        if (selfDef?.isContainer) return undefined;
        if (selectedParentInfo) return selectedParentInfo.index + 1;
        return undefined;
    }, [selectedComponent, selectedParentInfo]);

    const value = useMemo<PageBuilderContextValue>(
        () => ({
            canvasItems,
            selectedId,
            selectedComponent,
            selectedContainerForInsert,
            selectedInsertIndex,
            page,
            addComponent,
            removeComponent,
            moveComponent,
            selectComponent,
            updateComponentProps,
            updateComponentLayout,
            exportedHtml,
            exportAsHtml,
        }),
        [
            canvasItems,
            selectedId,
            selectedComponent,
            selectedContainerForInsert,
            selectedInsertIndex,
            page,
            addComponent,
            removeComponent,
            moveComponent,
            selectComponent,
            updateComponentProps,
            updateComponentLayout,
            exportedHtml,
            exportAsHtml,
        ],
    );

    return (
        <PageBuilderContext.Provider value={value}>
            {children}
        </PageBuilderContext.Provider>
    );
};

export const usePageBuilder = (): PageBuilderContextValue => {
    const ctx = useContext(PageBuilderContext);
    if (!ctx)
        throw new Error(
            "usePageBuilder must be used within a PageBuilderProvider",
        );
    return ctx;
};

export const coreLibrary = rawLibrary as unknown as ComponentDefinition[];
