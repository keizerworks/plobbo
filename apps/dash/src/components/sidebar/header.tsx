"use client";

import React from "react";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import { Slash } from "lucide-react";

import UpdateBlogMetadataForm from "../blogs/metadata/update";
import PublishBlog from "../blogs/publish";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "./sidebar";

export default function DashboardHeader() {
  const stryId: string | undefined = useParams({
    strict: false,
    select: (s) => s["story-id"],
  });
  const pathname = useLocation().pathname;

  // Create breadcrumb segments from the pathname
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex bg-[#FAF9F7] h-10 shrink-0 items-center gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2 -ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="tracking-tighter font-semibold">
                <Link to={"/journey"}>Plobbo</Link>
              </BreadcrumbPage>
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
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="tracking-tighter font-semibold">
                        {formattedSegment}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbPage className="tracking-tighter font-semibold">
                        <Link to={path}>{formattedSegment}</Link>
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {stryId ? (
          <>
            <UpdateBlogMetadataForm />
            <PublishBlog />
          </>
        ) : null}
      </div>
    </header>
  );
}
