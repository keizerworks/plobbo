import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Clock, LinkIcon } from "lucide-react";

import { BlogStatusEnum } from "@plobbo/validator/blog/list";

import { cn } from "~/lib/utils";
import { getActiveOrg } from "~/store/active-org";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

interface StoryCardProps {
  id: string;
  title: string;
  description?: string;
  slug: string;
  date: string;
  status: BlogStatusEnum;
  imageSrc: string | null;
  imageAlt: string | null;
  initials: string | null;
  length: number;
  index: number;
}

export function StoryCard({
  id,
  title,
  description,
  slug,
  date,
  status,
  imageSrc,
  imageAlt = "Post thumbnail",
  initials = "RK",
  length,
  index,
}: StoryCardProps) {
  const navigate = useNavigate();
  const param = useParams({ from: "/journey/$journey-id/" });
  const handleNavigate = () => {
    navigate({
      to: "/journey/$journey-id/$story-id",
      params: { "journey-id": param["journey-id"], "story-id": id },
    });
  };

  const orgnaization = getActiveOrg();
  return (
    <div className="flex flex-col">
      <Card
        onClick={handleNavigate}
        className="overflow-hidden hover:bg-neutral-100 bg-[#FAF9F7] transition-all cursor-pointer border-neutral-300 rounded-sm shadow-none w-full"
      >
        <CardContent className="p-4 flex items-start justify-between">
          <div className="flex items-start gap-4 w-full">
            <Avatar className="h-10 w-10 rounded-md border-neutral-400 border">
              {imageSrc ? (
                <AvatarImage
                  src={imageSrc || "/placeholder.svg"}
                  alt={imageAlt ?? ""}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-sm text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pt-1 w-full">
              <header className="flex gap-4 items-center w-full">
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between w-full gap-2 flex-wrap">
                    <h2 className="text-2xl font-semibold tracking-tighter text-black">
                      {title}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-4 py-1 leading-none font-semibold tracking-tight shadow-none",
                        status === BlogStatusEnum.DRAFT
                          ? "bg-[#ffe6b5]/50 hover:bg-[#ffe6b5]"
                          : "bg-[#cfffb5]/50 hover:bg-[#cfffb5]",
                      )}
                    >
                      {status === BlogStatusEnum.DRAFT ? "Draft" : "Published"}
                    </Badge>
                  </div>
                </div>
              </header>
              <div className="pt-2">
                {description && (
                  <p className="text-base tracking-tight text-neutral-500">
                    {description}
                  </p>
                )}
                <div
                  className={`flex ${description ? "pt-4 " : ""} flex-wrap text-neutral-700 items-center gap-4 text-sm tracking-tight `}
                >
                  {status === BlogStatusEnum.PUBLISHED && (
                    <a
                      target="_blank"
                      href={`https://plobbo.com/${orgnaization?.slug}/${slug}`}
                      className="flex font-medium items-center gap-1 cursor-pointer hover:underline"
                    >
                      <LinkIcon size={12} />
                      {slug}
                    </a>
                  )}
                  <div className="flex font-medium items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {length > 1 && index < length - 1 && (
        <div className="h-6 border border-neutral-200 border-y-0 w-1 bg-neutral-100 ml-8" />
      )}
    </div>
  );
}
