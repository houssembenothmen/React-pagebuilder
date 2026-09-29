"use client";

import { type ElementType, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    as?: ElementType;
    className?: string;
}

const EditableText = ({ value, onChange, as: Tag = "span", className }: EditableTextProps) => {
    const handleBlur = (e: FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent ?? "";
        if (text !== value) onChange(text);
    };

    return (
        <Tag
            className={className}
            contentEditable
            suppressContentEditableWarning
            onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}
            onKeyDown={(e: KeyboardEvent<HTMLElement>) => e.stopPropagation()}
            onBlur={handleBlur}
        >
            {value}
        </Tag>
    );
};

export default EditableText;