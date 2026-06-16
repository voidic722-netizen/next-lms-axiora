"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItemProps {
  readonly value: string;
  readonly question: string;
  readonly answer: string;
}

export function FAQItem({ value, question, answer }: FAQItemProps) {
  return (
    <AccordionItem
      value={value}
      className="border-b border-slate-100 last:border-b-0"
    >
      <AccordionTrigger className="text-left text-base font-medium text-slate-900 hover:text-purple-600 hover:no-underline py-6 transition-colors duration-200">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-base text-slate-500 leading-relaxed pb-6 font-light">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}