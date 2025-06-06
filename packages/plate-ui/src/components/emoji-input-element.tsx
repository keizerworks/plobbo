import { useMemo, useState } from "react";
import { withRef } from "@udecode/cn";
import { EmojiInlineIndexSearch, insertEmoji } from "@udecode/plate-emoji";
import { EmojiPlugin } from "@udecode/plate-emoji/react";
import { usePluginOption } from "@udecode/plate/react";

import { useDebounce } from "../hooks/use-debounce";
import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from "./inline-combobox";
import { PlateElement } from "./plate-element";

export const EmojiInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { children, editor, element } = props;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = usePluginOption(EmojiPlugin, "data")!;
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 100);
    const isPending = value !== debouncedValue;

    const filteredEmojis = useMemo(() => {
      if (debouncedValue.trim().length === 0) return [];

      return EmojiInlineIndexSearch.getInstance(data)
        .search(debouncedValue.replace(/:$/, ""))
        .get();
    }, [data, debouncedValue]);

    return (
      <PlateElement
        ref={ref}
        as="span"
        className={className}
        data-slate-value={element.value}
        {...props}
      >
        <InlineCombobox
          value={value}
          element={element}
          filter={false}
          setValue={setValue}
          trigger=":"
          hideWhenNoValue
        >
          <InlineComboboxInput />

          <InlineComboboxContent>
            {!isPending && (
              <InlineComboboxEmpty>No results</InlineComboboxEmpty>
            )}

            <InlineComboboxGroup>
              {filteredEmojis.map((emoji) => (
                <InlineComboboxItem
                  key={emoji.id}
                  value={emoji.name}
                  onClick={() => insertEmoji(editor, emoji)}
                >
                  {emoji.skins[0]?.native} {emoji.name}
                </InlineComboboxItem>
              ))}
            </InlineComboboxGroup>
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    );
  },
);
