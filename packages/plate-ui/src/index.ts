import type { Value } from "@udecode/plate";
import { withProps } from "@udecode/cn";
import {
  BaseParagraphPlugin,
  createSlateEditor,
  serializeHtml,
  SlateLeaf,
} from "@udecode/plate";
import { BaseAlignPlugin } from "@udecode/plate-alignment";
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from "@udecode/plate-basic-marks";
import { BaseBlockquotePlugin } from "@udecode/plate-block-quote";
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from "@udecode/plate-code-block";
import { BaseCommentsPlugin } from "@udecode/plate-comments";
import { createPlateEditor } from "@udecode/plate-core/react";
import { BaseDatePlugin } from "@udecode/plate-date";
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from "@udecode/plate-font";
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from "@udecode/plate-heading";
import { BaseHighlightPlugin } from "@udecode/plate-highlight";
import { BaseHorizontalRulePlugin } from "@udecode/plate-horizontal-rule";
import { BaseIndentPlugin } from "@udecode/plate-indent";
import { BaseIndentListPlugin } from "@udecode/plate-indent-list";
import { BaseKbdPlugin } from "@udecode/plate-kbd";
import { BaseColumnItemPlugin, BaseColumnPlugin } from "@udecode/plate-layout";
import { BaseLineHeightPlugin } from "@udecode/plate-line-height";
import { BaseLinkPlugin } from "@udecode/plate-link";
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from "@udecode/plate-math";
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from "@udecode/plate-media";
import { BaseMentionPlugin } from "@udecode/plate-mention";
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from "@udecode/plate-table";
import { BaseTogglePlugin } from "@udecode/plate-toggle";
import { all, createLowlight } from "lowlight";

import { BlockquoteElementStatic } from "./components/blockquote-element-static";
import { CodeBlockElementStatic } from "./components/code-block-element-static";
import { CodeLeafStatic } from "./components/code-leaf-static";
import { CodeLineElementStatic } from "./components/code-line-element-static";
import { CodeSyntaxLeafStatic } from "./components/code-syntax-leaf-static";
import { ColumnElementStatic } from "./components/column-element-static";
import { ColumnGroupElementStatic } from "./components/column-group-element-static";
import { CommentLeafStatic } from "./components/comment-leaf-static";
import { DateElementStatic } from "./components/date-element-static";
import { EditorStatic } from "./components/editor-static";
import { EquationElementStatic } from "./components/equation-element-static";
import { HeadingElementStatic } from "./components/heading-element-static";
import { HighlightLeafStatic } from "./components/highlight-leaf-static";
import { HrElementStatic } from "./components/hr-element-static";
import { ImageElementStatic } from "./components/image-element-static";
import { FireLiComponent, FireMarker } from "./components/indent-fire-marker";
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from "./components/indent-todo-marker-static";
import { InlineEquationElementStatic } from "./components/inline-equation-element-static";
import { KbdLeafStatic } from "./components/kbd-leaf-static";
import { LinkElementStatic } from "./components/link-element-static";
import { MediaAudioElementStatic } from "./components/media-audio-element-static";
import { MediaFileElementStatic } from "./components/media-file-element-static";
import { MediaVideoElementStatic } from "./components/media-video-element-static";
import { MentionElementStatic } from "./components/mention-element-static";
import { ParagraphElementStatic } from "./components/paragraph-element-static";
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from "./components/table-cell-element-static";
import { TableElementStatic } from "./components/table-element-static";
import { TableRowElementStatic } from "./components/table-row-element-static";
import { TocElementStatic } from "./components/toc-element-static";
import { ToggleElementStatic } from "./components/toggle-element-static";
import { createHtmlDocument } from "./lib/create-html-document";

const lowlight = createLowlight(all);

export const components = {
  [BaseAudioPlugin.key]: MediaAudioElementStatic,
  [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
  [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: "strong" }),
  [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
  [BaseCodeLinePlugin.key]: CodeLineElementStatic,
  [BaseCodePlugin.key]: CodeLeafStatic,
  [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
  [BaseColumnItemPlugin.key]: ColumnElementStatic,
  [BaseColumnPlugin.key]: ColumnGroupElementStatic,
  [BaseCommentsPlugin.key]: CommentLeafStatic,
  [BaseDatePlugin.key]: DateElementStatic,
  [BaseEquationPlugin.key]: EquationElementStatic,
  [BaseFilePlugin.key]: MediaFileElementStatic,
  [BaseHighlightPlugin.key]: HighlightLeafStatic,
  [BaseHorizontalRulePlugin.key]: HrElementStatic,
  [BaseImagePlugin.key]: ImageElementStatic,
  [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
  [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: "em" }),
  [BaseKbdPlugin.key]: KbdLeafStatic,
  [BaseLinkPlugin.key]: LinkElementStatic,
  // [BaseMediaEmbedPlugin.key]: MediaEmbedElement,
  [BaseMentionPlugin.key]: MentionElementStatic,
  [BaseParagraphPlugin.key]: ParagraphElementStatic,
  [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: "del" }),
  [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: "sub" }),
  [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: "sup" }),
  [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
  [BaseTableCellPlugin.key]: TableCellElementStatic,
  [BaseTablePlugin.key]: TableElementStatic,
  [BaseTableRowPlugin.key]: TableRowElementStatic,
  [BaseTocPlugin.key]: TocElementStatic,
  [BaseTogglePlugin.key]: ToggleElementStatic,
  [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: "u" }),
  [BaseVideoPlugin.key]: MediaVideoElementStatic,
  [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: "h1" }),
  [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: "h2" }),
  [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: "h3" }),
  [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: "h4" }),
  [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: "h5" }),
  [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: "h6" }),
};

export const plugins = [
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
  BaseColumnPlugin,
  BaseColumnItemPlugin,
  BaseTocPlugin,
  BaseVideoPlugin,
  BaseAudioPlugin,
  BaseParagraphPlugin,
  BaseHeadingPlugin,
  BaseMediaEmbedPlugin,
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
  BaseBlockquotePlugin,
  BaseDatePlugin,
  // @ts-expect-error -- idk
  BaseCodeBlockPlugin.configure({ options: { lowlight } }),
  BaseIndentPlugin.extend({
    inject: {
      targetPlugins: [
        BaseParagraphPlugin.key,
        BaseBlockquotePlugin.key,
        BaseCodeBlockPlugin.key,
      ],
    },
  }),
  BaseIndentListPlugin.extend({
    inject: {
      targetPlugins: [
        BaseParagraphPlugin.key,
        ...HEADING_LEVELS,
        BaseBlockquotePlugin.key,
        BaseCodeBlockPlugin.key,
        BaseTogglePlugin.key,
      ],
    },
    options: {
      listStyleTypes: {
        fire: {
          liComponent: FireLiComponent,
          markerComponent: FireMarker,
          type: "fire",
        },
        todo: {
          liComponent: TodoLiStatic,
          markerComponent: TodoMarkerStatic,
          type: "todo",
        },
      },
    },
  }),
  BaseLinkPlugin,
  BaseTableRowPlugin,
  BaseTablePlugin,
  BaseTableCellPlugin,
  BaseHorizontalRulePlugin,
  BaseFontColorPlugin,
  BaseFontBackgroundColorPlugin,
  BaseFontSizePlugin,
  BaseKbdPlugin,
  BaseAlignPlugin.extend({
    inject: {
      targetPlugins: [
        BaseParagraphPlugin.key,
        BaseMediaEmbedPlugin.key,
        ...HEADING_LEVELS,
        BaseImagePlugin.key,
      ],
    },
  }),
  BaseLineHeightPlugin,
  BaseHighlightPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMentionPlugin,
  BaseCommentsPlugin,
  BaseTogglePlugin,
];

export const convertToHtml = async (value: Value) => {
  const editor = createSlateEditor({
    plugins,
    value,
  });

  const theme = "light";
  //
  // Get the editor content HTML using EditorStatic
  const editorHtml = await serializeHtml(editor, {
    components,
    editorComponent: EditorStatic,
    props: {
      style: {
        padding: "0 calc(50% - 350px)",
        paddingBottom: "",
        height: "100%",
      },
    },
  });

  const html = createHtmlDocument({
    editorHtml,
    theme,
  });

  return html;
};

export { createPlateEditor, createSlateEditor, serializeHtml };
