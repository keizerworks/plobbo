import mitt from "mitt";

import type { EmitterInterface } from "./emitter.interface";

export const emitter = mitt<EmitterInterface>();
