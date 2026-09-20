"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/variants";

export default function ArchitectureDiagram({ image }: { image: string | null }) {
  if (!image) return null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative w-full rounded-xl overflow-hidden border border-[var(--border)]"
    >
      <Image
        src={image}
        alt="Architecture diagram"
        width={1240}
        height={230}
        className="w-full h-auto"
        sizes="(max-width: 860px) 100vw, 860px"
      />
    </motion.div>
  );
}
