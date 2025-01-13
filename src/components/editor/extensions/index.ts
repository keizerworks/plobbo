import { defaultExtensions } from "./default-extensions";
import { slashCommand } from "./slash-command";

export const novelExtensions = [...defaultExtensions, slashCommand];
