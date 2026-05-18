import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="w-full">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={i}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="block aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary"
                aria-label={`${alt} — ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`${alt} — ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <>
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === current ? "w-6 bg-primary-glow" : "w-1.5 bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "aspect-video overflow-hidden rounded-md border bg-secondary transition-all",
                  i === current
                    ? "border-primary-glow ring-2 ring-primary/30"
                    : "border-border opacity-60 hover:opacity-100",
                )}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-5xl border-border bg-background p-2">
          {lightbox !== null && (
            <img
              src={images[lightbox]}
              alt={`${alt} — ${lightbox + 1}`}
              className="max-h-[85vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}