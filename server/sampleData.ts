import { SampleClaim } from "../src/types.js";

export const SAMPLE_CLAIMS: SampleClaim[] = [
  {
    id: "sample-1",
    title: "Drinking Boiled Garlic Water Cures COVID-19 & Flu",
    category: "Health & Science",
    snippet:
      "A viral WhatsApp message claims that boiling 8 cloves of garlic in water and drinking the broth overnight will completely cure any coronavirus infection and eliminate flu symptoms in 12 hours.",
    expectedVerdict: "False",
  },
  {
    id: "sample-2",
    title: "James Webb Telescope Discovered Massive Ancient Galaxies That Defy Physics",
    category: "Tech & AI",
    snippet:
      "NASA's James Webb Space Telescope observed candidate massive galaxies in the early universe, prompting astrophysicists to reassess cosmological models of early galaxy growth rates.",
    expectedVerdict: "True",
  },
  {
    id: "sample-3",
    title: "5G Cellular Towers Emit Radiation Causing Immediate Bird Deaths",
    category: "Viral Social Media",
    snippet:
      "Posts on TikTok and Facebook claim hundreds of birds suddenly dropped dead directly under newly installed 5G base stations due to microwave frequency poisoning.",
    expectedVerdict: "False",
  },
  {
    id: "sample-4",
    title: "Bananas Contain Dangerous Levels of Radiation That Harm DNA",
    category: "Health & Science",
    snippet:
      "A blog warns people against eating more than one banana a day, claiming the radioactive Potassium-40 isotope poses a severe cancer risk to human organs.",
    expectedVerdict: "Misleading",
  },
  {
    id: "sample-5",
    title: "Secret Satellite Crash in Remote Desert Kept Hidden by NATO",
    category: "Breaking News",
    snippet:
      "Anonymous reports allege an experimental quantum surveillance satellite crashed in the Sahara Desert yesterday, triggering a covert military containment operation.",
    expectedVerdict: "Unverified",
  },
  {
    id: "sample-6",
    title: "Global Temperatures in 2023–2024 Broke All-Time Historical Records",
    category: "Health & Science",
    snippet:
      "Copernicus Climate Change Service and NASA confirmed that 2023 was the warmest year globally since records began in 1850, driven by greenhouse gas emissions and El Niño.",
    expectedVerdict: "True",
  },
];
