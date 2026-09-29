// Central place that maps a semantic name -> the actual asset path.
// Update these paths if your folder structure differs.

import album from "../assets/icons/album.svg";
import alignJustify from "../assets/icons/align-justify.svg";
import alignCenter from "../assets/icons/aligncenter.svg";
import alignLeft from "../assets/icons/alignleft.svg";
import alignRight from "../assets/icons/alignright.svg";
import arrowClockwise from "../assets/icons/arrow-clockwise.svg";
import arrowCounterClockwise from "../assets/icons/arrow-counter-clockwise.svg";
import bold from "../assets/icons/bold.svg";
import caretDown from "../assets/icons/caret-down-md.svg";
import code from "../assets/icons/code.svg";
import frameCorners from "../assets/icons/frame-corners-thin.svg";
import imageSquare from "../assets/icons/image-square.svg";
import italic from "../assets/icons/italic.svg";
import link from "../assets/icons/link.svg";
import listBullets from "../assets/icons/list-bullets-fill.svg";
import listNumber from "../assets/icons/list-number.svg";
import paintBrush from "../assets/icons/paint-brush-bold.svg";
import pdfDocument from "../assets/icons/pdf-document.svg";
import quotes from "../assets/icons/quotes-end.svg";
import strikethrough from "../assets/icons/strikethrough.svg";
import videoFile from "../assets/icons/video-file.svg";

// NOTE: there was no underline icon in your icons folder, so this is a
// small inline placeholder (plain geometric shape, not from any icon
// pack) that renders through the exact same <Icon> component. Drop a
// real `underline.svg` into your assets folder and swap this import
// out whenever you're ready:
//   import underline from "../assets/icons/underline.svg";
const underlineFallbackMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M200,224a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H192A8,8,0,0,1,200,224ZM128,192c-35.3,0-64-28.65-64-64V40a8,8,0,0,1,16,0v88c0,26.47,21.53,48,48,48s48-21.53,48-48V40a8,8,0,0,1,16,0v88C192,163.35,163.3,192,128,192Z"/></svg>`;
const underline = `data:image/svg+xml;utf8,${encodeURIComponent(
    underlineFallbackMarkup
)}`;

  console.log(album, typeof album);


export const ICONS = {
    album,
    alignJustify,
    alignCenter,
    alignLeft,
    alignRight,
    arrowClockwise,
    arrowCounterClockwise,
    bold,
    caretDown,
    code,
    frameCorners,
    imageSquare,
    italic,
    link,
    listBullets,
    listNumber,
    paintBrush,
    pdfDocument,
    quotes,
    strikethrough,
    underline,
    videoFile,
} as const;

export type IconName = keyof typeof ICONS;