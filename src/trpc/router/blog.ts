import { blogCountHandler } from "trpc/handlers/blog/count";
import { createBlogHandler } from "trpc/handlers/blog/create";
import {
  deleteBlogHandler,
  deleteMultipleBlogHandler,
} from "trpc/handlers/blog/delete";
import { blogListHandler } from "trpc/handlers/blog/list";
import { blogGetHandler } from "trpc/handlers/blog/get";
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
