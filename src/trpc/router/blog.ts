import { blogCountHandler } from "trpc/handlers/blog/count";
import { createBlogHandler } from "trpc/handlers/blog/create";
import {
  deleteBlogHandler,
  deleteMultipleBlogHandler,
} from "trpc/handlers/blog/delete";
import { blogGetHandler } from "trpc/handlers/blog/get";
import { blogListHandler } from "trpc/handlers/blog/list";
import { updateBlogHandler } from "trpc/handlers/blog/update";

export const blogRouter = {
  get: blogGetHandler,
  list: blogListHandler,
  count: blogCountHandler,
  create: createBlogHandler,
  update: updateBlogHandler,
  delete: deleteBlogHandler,
  deleteMultiple: deleteMultipleBlogHandler,
};
