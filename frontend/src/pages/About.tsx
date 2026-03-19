import React from "react";
import { Feather } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-24 animate-fade-in">
      <div className="text-center mb-16">
        <Feather size={24} className="text-amber-blog mx-auto mb-4" />
        <h1 className="font-display text-5xl text-parchment mb-4 font-light">About</h1>
        <div className="w-12 h-px bg-amber-blog mx-auto" />
      </div>

      <div className="post-body space-y-6">
        <p>
          <strong>BibleCritique</strong> is an independent platform for honest, fearless scholarly
          inquiry into the Bible, religious tradition, and the history of Christian theology.
        </p>

        <p>
          We believe that sacred texts deserve the same rigorous analytical attention applied to
          any historical document. Questions about authorship, archaeological evidence, contradictions,
          and the sociopolitical contexts of biblical writing are not threats to honest faith — they
          are the foundation of it.
        </p>

        <blockquote>
          "The truth is not afraid of questions. Only dogma is."
        </blockquote>

        <h2>Our Approach</h2>
        <p>
          Every essay published here is grounded in peer-reviewed scholarship, historical evidence,
          and careful reasoning. We do not mock faith; we interrogate texts. We distinguish between
          the spiritual experience of believers and the academic study of religious documents.
        </p>

        <p>
          All viewpoints are welcome in our comment sections — provided they engage with the
          arguments rather than the persons making them. Personal attacks and hate speech are
          removed without exception.
        </p>

        <h2>A Safe Space for Hard Questions</h2>
        <p>
          If you grew up religious and began asking questions your community couldn't answer, you
          are exactly the reader this site is for. If you are a committed believer who enjoys
          serious theological debate, you are welcome too. Intellectual honesty is the only
          requirement.
        </p>
      </div>
    </div>
  );
}
