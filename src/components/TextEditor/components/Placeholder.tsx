import { useTranslations } from "next-intl";

export function Placeholder() {
    const t = useTranslations('editor');
    return <div className="Editor-placeholder">{t('placeholder')}</div>;
}