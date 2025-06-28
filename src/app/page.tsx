import { HomepageClient } from "@/components/layout/HomepageClient";
import type { Case, MediaItem } from "@/types";
import fs from "fs/promises";
import path from "path";

async function getCasesData(): Promise<Case[]> {
  const filePath = path.join(process.cwd(), "src", "data", "cases.json");
  try {
    const jsonData = await fs.readFile(filePath, "utf-8");
    const cases = JSON.parse(jsonData) as any[];

    // Backward compatibility: convert old structure to new media structure
    return cases.map((c) => {
      if (c.imageUrls && !c.media) {
        const media = (c.imageUrls as string[]).map(
          (url) => ({ type: "image", url } as MediaItem)
        );
        if (c.videoUrl) {
          media.unshift({ type: "video", url: c.videoUrl });
        }
        return { ...c, media, imageUrls: undefined, videoUrl: undefined };
      }
      return c as Case;
    });
  } catch (error) {
    console.error("Error reading or parsing cases.json:", error);
    return []; // Return empty array or default data in case of error
  }
}

export default async function HomePage() {
  const casesData = await getCasesData();

  return <HomepageClient casesData={casesData} />;
}
