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
import { useI18n } from "@/lib/i18n";

const WIDTHS = [320, 480, 640, 960, 1280, 1600, 1920];

/** Inject a Cloudinary width transform into the URL. */
function cloudinaryAt(url: string, w: number) {
  return url.replace(
    /(\/upload\/)(?:[^/]*\/)?/,
    (_m, p1) => `${p1}f_auto,q_auto,c_limit,w_${w}/`,
  );
}

/** Inject a width param for Unsplash URLs. */
function unsplashAt(url: string, w: number) {
  const u = new URL(url);
  u.searchParams.set("w", String(w));
  u.searchParams.set("auto", "format");
  u.searchParams.set("q", "75");
  return u.toString();
}

function buildResponsive(src: string) {
  try {
    if (/res\.cloudinary\.com\/.+\/upload\//.test(src)) {
      const srcSet = WIDTHS.map((w) => `${cloudinaryAt(src, w)} ${w}w`).join(", ");
      return { src: cloudinaryAt(src, 1280), srcSet };
    }
    if (/images\.unsplash\.com/.test(src)) {
      const srcSet = WIDTHS.map((w) => `${unsplashAt(src, w)} ${w}w`).join(", ");
      return { src: unsplashAt(src, 1280), srcSet };
    }
  } catch {
    /* fall through */
  }
  return { src, srcSet: undefined as string | undefined };
}

const MAIN_SIZES = "(min-width: 1280px) 1024px, (min-width: 768px) 80vw, 100vw";
const THUMB_SIZES = "(min-width: 640px) 160px, 25vw";

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const { dir } = useI18n();
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

  const responsive = images.map(buildResponsive);
  const lightboxResponsive = lightbox !== null ? buildResponsive(images[lightbox]) : null;

  return (
    <div className="space-y-4" dir={dir}>
      <Carousel
        setApi={setApi}
        opts={{ loop: images.length > 1, direction: dir }}
        className="w-full"
      >
        <CarouselContent>
          {responsive.map((r, i) => (
            <CarouselItem key={i}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="block aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary"
                aria-label={`${alt} — ${i + 1}`}
              >
                <img
                  src={r.src}
                  srcSet={r.srcSet}
                  sizes={MAIN_SIZES}
                  alt={`${alt} — ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding={i === 0 ? "sync" : "async"}
                  fetchPriority={i === 0 ? "high" : "low"}
                  draggable={false}
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
            {responsive.map((r, i) => (
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
                <img
                  src={r.src}
                  srcSet={r.srcSet}
                  sizes={THUMB_SIZES}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-5xl border-border bg-background p-2">
          {lightbox !== null && lightboxResponsive && (
            <img
              src={lightboxResponsive.src}
              srcSet={lightboxResponsive.srcSet}
              sizes="(min-width: 1280px) 1024px, 95vw"
              alt={`${alt} — ${lightbox + 1}`}
              className="max-h-[85vh] w-full rounded-lg object-contain"
              decoding="async"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}