"use client";

import React from "react";
import { useLocation, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import UpdateBlogMetadataForm from "../blogs/metadata/update";
import PublishBlog from "../blogs/publish";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "./sidebar";

export default function DashboardHeader() {
  const blogId = useParams({ strict: false, select: (s) => s["blog-id"] });
  const location = useLocation();
  const pathname = location.pathname;

  // Create breadcrumb segments from the pathname
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2 -ml-1" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              // Create the path up to this segment
              const path = `/${segments.slice(0, index + 1).join("/")}`;
              const isLast = index === segments.length - 1;

              // Format the segment for display (replace hyphens with spaces and capitalize)
              const formattedSegment = segment
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

              return (
                <React.Fragment key={path}>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={path}>
                        {formattedSegment}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <PublishBlog />
        {blogId ? <UpdateBlogMetadataForm /> : null}
      </div>
    </header>
  );
}
