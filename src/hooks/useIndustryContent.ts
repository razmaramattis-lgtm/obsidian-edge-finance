import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface IndustryContent {
  tagline?: string;
  intro?: string;
  body?: string;
  deliverables?: string[];
  cta_headline?: string;
}

export const useIndustryContent = (href: string) => {
  const [content, setContent] = useState<IndustryContent | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("industries")
        .select("tagline, intro, body, deliverables, cta_headline")
        .eq("href", href)
        .maybeSingle();
      if (data) {
        // Only set fields that have actual content
        const result: IndustryContent = {};
        if (data.tagline) result.tagline = data.tagline;
        if (data.intro) result.intro = data.intro;
        if (data.body) result.body = data.body;
        if (data.deliverables && data.deliverables.length > 0) result.deliverables = data.deliverables;
        if (data.cta_headline) result.cta_headline = data.cta_headline;
        if (Object.keys(result).length > 0) setContent(result);
      }
    };
    fetch();
  }, [href]);

  return content;
};
