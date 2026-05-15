import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({
  id, title, eyebrow, children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          {eyebrow && (
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
              {eyebrow}
            </div>
          )}
          <h2 className="text-3xl font-bold md:text-5xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}