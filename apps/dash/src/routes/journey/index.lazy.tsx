import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { format } from "date-fns";
import { Clock, Loader2, Search } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { createJourney, getJourney } from "~/actions/journey";
import { ImageUpload } from "~/components/image-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/plate-ui/dialog";
import { PlobboCircle } from "~/components/plobbo-circle";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { createJourneyTable } from "~/interface/journey";
import { useAuthStore } from "~/store/auth";

export const Route = createLazyFileRoute("/journey/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profile } = useAuthStore();
  const { journeys: initialJourneys, activeOrgId } = useLoaderData({
    from: "/journey/",
  });

  const { data: journeys } = useQuery({
    queryKey: ["journeys", activeOrgId],
    queryFn: () => getJourney(activeOrgId),
    initialData: initialJourneys,
  });
  const navigate = useNavigate();

  const { jrny } = useLocation().search;
  const handleSearch = (name: string) => {
    navigate({
      to: "/journey",
      search: { jrny: name.length > 0 ? name : undefined },
    });
  };

  const filteredJourney = useMemo(() => {
    return journeys.filter((journey) =>
      journey.title.toLowerCase().includes(jrny ?? ""),
    );
  }, [jrny]);

  return (
    <main className="mx-auto bg-white flex w-full flex-col h-full">
      {journeys.length < 1 ? (
        <section className="max-w-7xl mx-auto relative h-full w-full flex items-center justify-center">
          <div className="absolute bg-white/80 inset-0 backdrop-blur-[70px] z-20 " />
          <BackgroundGradient />
          <div className="flex flex-col justify-center items-center relative z-50 -translate-y-10">
            <div className="text-center">
              <h1 className="text-[55px] font-semibold tracking-tight flex flex-wrap justify-center">
                {["Welcome", "To", "Plobbo"].map((word, index) => (
                  <motion.span
                    key={index}
                    className="mx-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      mass: 1,
                      delay: index * 0.04,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  mass: 1,
                  delay: 0.3,
                }}
                className="flex items-center justify-center py-4 gap-2"
              >
                <PlobboCircle value="green" />
                <PlobboCircle value="violet" />
                <PlobboCircle value="yellow" />
                <PlobboCircle value="pink" />
              </motion.div>
              <motion.p
                className="text-black"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  mass: 1,
                  delay: 0.4,
                }}
              >
                It's time to add a new Journey
              </motion.p>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                mass: 1,
                delay: 0.6,
              }}
            >
              {activeOrgId && <CreateJourney orgId={activeOrgId} />}
            </motion.div>
          </div>
        </section>
      ) : (
        <>
          <div className="">
            <header className="flex items-center max-w-[1536px] mx-auto p-8 gap-x-2 justify-between w-full">
              <h1 className="font-semibold text-4xl tracking-tighter ">
                Welcome {profile?.name ? profile?.name : "back"}, Let's make new
                journey.
              </h1>
              <div className="flex items-center gap-2">
                {activeOrgId && (
                  <CreateJourney orgId={activeOrgId} name="Create journey" />
                )}
              </div>
            </header>
          </div>
          <div className="bg-none">
            <div className="max-w-[1536px] grid grid-cols-2 mx-auto w-full py-0 px-8">
              <div className="relative">
                <Input
                  placeholder="Find your documented journey..."
                  className="bg-[#FAF9F7] outline-none focus-visible:outline-none focus-visible:ring-0 placeholder:text-neutral-600 font-medium tracking-tight"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-2 text-neutral-600">
                  <Search size={18} />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[1536px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-8">
            {filteredJourney.map((journey) => {
              return (
                <Card
                  className="p-[20px] w-full border border-neutral-300 bg-[#FAF9F7] flex flex-col justify-between rounded-sm shadow-none hover:bg-neutral-100 cursor-pointer transition-all"
                  onClick={() => {
                    navigate({
                      to: "/journey/$journey-id",
                      params: { "journey-id": journey.id },
                    });
                  }}
                >
                  <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-semibold tracking-tighter">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-md border border-neutral-400">
                          <AvatarImage
                            src={journey.image}
                            alt={journey.title}
                            className="object-cover"
                          />
                          <AvatarFallback className="rounded-md">
                            <span className="text-base">
                              {journey.title.slice(0, 2)}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                        {journey.title}
                      </div>
                    </CardTitle>
                    <CardDescription className="font-medium text-neutral-800">
                      {journey.description
                        ? journey?.description?.length > 120
                          ? `${journey?.description?.slice(0, 120)}...`
                          : journey?.description
                        : `${journey.title}'s journey`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 pt-2 flex items-center gap-1 text-xs text-neutral-500">
                    <Clock size={14} />
                    {journey.createdAt
                      ? format(journey.createdAt, "MMMM d, yyyy 'at' h:mm a")
                      : "N/A"}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}

const BackgroundGradient = () => {
  return (
    <motion.svg
      className="absolute opacity-80 scale-75 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#a896ff">
            <animate
              attributeName="stop-color"
              values="#a896ff; #67e8f9; #a896ff"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="33%" stop-color="#9370db">
            <animate
              attributeName="stop-color"
              values="#9370db; #70D7F6; #9370db"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="66%" stop-color="#70D7F6">
            <animate
              attributeName="stop-color"
              values="#70D7F6; #9370db; #70D7F6"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stop-color="#67e8f9">
            <animate
              attributeName="stop-color"
              values="#67e8f9; #a896ff; #67e8f9"
              dur="4s"
              repeatCount="indefinite"
            />
          </stop>
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="white" />
      <circle cx="400" cy="300" r="300" fill="url(#grad)" filter="url(#blur)" />
    </motion.svg>
  );
};

const CreateJourney = ({ orgId, name }: { orgId: string; name?: string }) => {
  const [journeyName, setJourneyName] = useState<string>("");
  const [journeyDescription, setJourneyDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined); // State for the image file
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: createJourney,
    onSuccess: (data) => {
      toast.success("Created journey successfully!");
      queryClient.invalidateQueries({ queryKey: ["journeys", orgId] });
      navigate({
        to: "/journey/$journey-id",
        params: { "journey-id": data.id },
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to create journey");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      organizationId: orgId,
      title: journeyName,
      description: journeyDescription,
      image: imageFile?.name || "",
    };

    const validation = createJourneyTable.safeParse(data);

    if (!validation.success) {
      console.error("Validation failed:", validation.error.format());
      return;
    }

    const formData = new FormData();
    formData.append("organizationId", orgId);
    formData.append("title", journeyName);
    formData.append("description", journeyDescription);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-fit mt-4 rounded-full">
          {name ?? "Create Now"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/80 backdrop-blur-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-4xl tracking-tighter">
              Let's start your journey
            </DialogTitle>
            <DialogDescription>Create your first journey</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <ImageUpload
                className="font-semibold tracking-tight"
                aspectVideo
                onChange={(file) => setImageFile(file)}
              />
            </div>

            <div className="items-center gap-4">
              <Input
                id="title"
                placeholder="Enter your journey name..."
                className="font-semibold tracking-tight"
                value={journeyName}
                onChange={(e) => setJourneyName(e.target.value)}
              />
            </div>
            <div className="items-center gap-4">
              <Input
                id="description"
                placeholder="Enter your journey description..."
                className="font-semibold tracking-tight"
                value={journeyDescription}
                onChange={(e) => setJourneyDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            {isPending ? (
              <Button type="submit" className="rounded-full">
                <Loader2 className="animate-spin mr-2" />
                Creating...
              </Button>
            ) : (
              <Button type="submit" className="rounded-full">
                Create
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
