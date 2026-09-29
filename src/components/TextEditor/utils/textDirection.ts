/**
 * Checks if the given text is predominantly Arabic
 * @param text - The text to analyze
 * @returns true if more than 50% of characters are Arabic
 */
export const isArabicText = (text: string): boolean => {
    if (!text) return false;

    // Arabic Unicode ranges: U+0600-U+06FF (main), U+0750-U+077F (supplement), U+08A0-U+08FF (extended)
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;

    // Count Arabic characters
    const arabicMatches = text.match(arabicRegex) || [];
    const arabicCount = arabicMatches.length;

    // Count total characters (excluding spaces and punctuation for better accuracy)
    const totalChars = text.replace(/[\s\p{P}]/gu, '').length;

    if (totalChars === 0) return false;

    // Return true if more than 50% of characters are Arabic
    return (arabicCount / totalChars) > 0.5;
};

/**
 * Strict version that includes spaces and punctuation in the count
 * @param text - The text to analyze
 * @returns true if more than 50% of all characters are Arabic
 */
export const isArabicTextStrict = (text: string): boolean => {
    if (!text) return false;

    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
    const arabicMatches = text.match(arabicRegex) || [];
    const arabicCount = arabicMatches.length;

    // Count all characters including spaces and punctuation
    const totalChars = text.length;

    // Return true if more than 50% of all characters are Arabic
    return (arabicCount / totalChars) > 0.5;
};

/**
 * Determines the text direction based on content
 * @param text - The text to analyze
 * @returns 'rtl' for Arabic text, 'ltr' otherwise
 */
export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
    return isArabicText(text) ? 'rtl' : 'ltr';
};

/**
 * Gets the percentage of Arabic characters for debugging
 * @param text - The text to analyze
 * @returns Percentage of Arabic characters (0-100)
 */
export const getArabicPercentage = (text: string): number => {
    if (!text) return 0;

    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
    const arabicMatches = text.match(arabicRegex) || [];
    const arabicCount = arabicMatches.length;
    const totalChars = text.replace(/[\s\p{P}]/gu, '').length;

    if (totalChars === 0) return 0;

    return Math.round((arabicCount / totalChars) * 100);
};