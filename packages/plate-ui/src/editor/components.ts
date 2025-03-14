"use client";

import { withProps } from "@udecode/cn";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { CommentsPlugin } from "@udecode/plate-comments/react";
import { DatePlugin } from "@udecode/plate-date/react";
import { ExcalidrawPlugin } from "@udecode/plate-excalidraw/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { TocPlugin } from "@udecode/plate-heading/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { ColumnItemPlugin, ColumnPlugin } from "@udecode/plate-layout/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import {
  EquationPlugin,
  InlineEquationPlugin,
} from "@udecode/plate-math/react";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from "@udecode/plate-media/react";
import { MentionPlugin } from "@udecode/plate-mention/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@udecode/plate-table/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { ParagraphPlugin, PlateLeaf } from "@udecode/plate/react";

import { BlockquoteElementStatic } from "../components/blockquote-element-static";
import { CodeBlockElementStatic } from "../components/code-block-element-static";
import { CodeLeafStatic } from "../components/code-leaf-static";
import { CodeLineElementStatic } from "../components/code-line-element-static";
import { CodeSyntaxLeafStatic } from "../components/code-syntax-leaf-static";
import { ColumnElementStatic } from "../components/column-element-static";
import { ColumnGroupElementStatic } from "../components/column-group-element-static";
import { CommentLeafStatic } from "../components/comment-leaf-static";
import { DateElementStatic } from "../components/date-element-static";
import { EquationElementStatic } from "../components/equation-element-static";
import { ExcalidrawElement } from "../components/excalidraw-element";
import { HeadingElementStatic } from "../components/heading-element-static";
import { HighlightLeafStatic } from "../components/highlight-leaf-static";
import { HrElementStatic } from "../components/hr-element-static";
import { ImageElementStatic } from "../components/image-element-static";
import { InlineEquationElementStatic } from "../components/inline-equation-element-static";
import { KbdLeafStatic } from "../components/kbd-leaf-static";
import { LinkElementStatic } from "../components/link-element-static";
import { MediaAudioElementStatic } from "../components/media-audio-element-static";
import { MediaEmbedElement } from "../components/media-embed-element";
import { MediaFileElementStatic } from "../components/media-file-element-static";
import { MediaPlaceholderElement } from "../components/media-placeholder-element";
import { MediaVideoElementStatic } from "../components/media-video-element-static";
import { MentionElementStatic } from "../components/mention-element-static";
import { ParagraphElementStatic } from "../components/paragraph-element-static";
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from "../components/table-cell-element-static";
import { TableElementStatic } from "../components/table-element-static";
import { TableRowElementStatic } from "../components/table-row-element-static";
import { TocElementStatic } from "../components/toc-element-static";
import { ToggleElementStatic } from "../components/toggle-element-static";

export const components = {
  [AudioPlugin.key]: MediaAudioElementStatic,
  [BlockquotePlugin.key]: BlockquoteElementStatic,
  //  [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
  [CodeBlockPlugin.key]: CodeBlockElementStatic,
  [CodeLinePlugin.key]: CodeLineElementStatic,
  [CodePlugin.key]: CodeLeafStatic,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
  [ColumnItemPlugin.key]: ColumnElementStatic,
  [ColumnPlugin.key]: ColumnGroupElementStatic,
  [CommentsPlugin.key]: CommentLeafStatic,
  [DatePlugin.key]: DateElementStatic,
  [EquationPlugin.key]: EquationElementStatic,
  // [ExcalidrawPlugin.key]: ExcalidrawElement,
  [FilePlugin.key]: MediaFileElementStatic,
  [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: "h1" }),
  [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: "h2" }),
  [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: "h3" }),
  [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: "h4" }),
  [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: "h5" }),
  [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: "h6" }),
  [HighlightPlugin.key]: HighlightLeafStatic,
  [HorizontalRulePlugin.key]: HrElementStatic,
  [ImagePlugin.key]: ImageElementStatic,
  [InlineEquationPlugin.key]: InlineEquationElementStatic,
  //  [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
  [KbdPlugin.key]: KbdLeafStatic,
  [LinkPlugin.key]: LinkElementStatic,
  // [MediaEmbedPlugin.key]: MediaEmbedElement,
  [MentionPlugin.key]: MentionElementStatic,
  [ParagraphPlugin.key]: ParagraphElementStatic,
  [PlaceholderPlugin.key]: MediaPlaceholderElement,
  //  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
  //  [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
  //  [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
  [TableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
  [TableCellPlugin.key]: TableCellElementStatic,
  [TablePlugin.key]: TableElementStatic,
  [TableRowPlugin.key]: TableRowElementStatic,
  [TocPlugin.key]: TocElementStatic,
  [TogglePlugin.key]: ToggleElementStatic,
  //  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
  [VideoPlugin.key]: MediaVideoElementStatic,
};
