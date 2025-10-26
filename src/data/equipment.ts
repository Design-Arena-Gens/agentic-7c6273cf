export type RentalPlan = "daily" | "weekly" | "monthly";

export interface Equipment {
  id: string;
  name: string;
  slug: string;
  category: "Earthmoving" | "Concrete" | "Surveying" | "Material Handling" | "Compaction";
  description: string;
  image: string;
  highlight: string;
  specs: { label: string; value: string }[];
  pricing: Record<RentalPlan, number>;
  availability: {
    locations: string[];
    leadTime: string;
  };
}

export const rentalPlans: { key: RentalPlan; label: string; description: string }[] = [
  {
    key: "daily",
    label: "Daily",
    description: "Ideal for short-term jobs and urgent mobilizations.",
  },
  {
    key: "weekly",
    label: "Weekly",
    description: "Best value for focused site work and batch pours.",
  },
  {
    key: "monthly",
    label: "Monthly",
    description: "Long-term deployments with priority servicing.",
  },
];

export const equipments: Equipment[] = [
  {
    id: "eq-excavator-320d",
    name: "CAT 320D Hydraulic Excavator",
    slug: "cat-320d-hydraulic-excavator",
    category: "Earthmoving",
    description:
      "27-ton class excavator with high breakout force for deep trenching, landscaping, and bulk earthworks.",
    highlight: "Grade-assist, 1.2 m³ bucket, quick coupler ready.",
    image:
      "https://images.unsplash.com/photo-1590490359854-dfba19688d87?auto=format&fit=crop&w=1100&q=80",
    specs: [
      { label: "Operating Weight", value: "27,500 kg" },
      { label: "Dig Depth", value: "6.7 m" },
      { label: "Engine Power", value: "159 kW" },
      { label: "Fuel Burn", value: "17–22 L/hr" },
    ],
    pricing: {
      daily: 18500,
      weekly: 105000,
      monthly: 360000,
    },
    availability: {
      locations: ["Mumbai", "Pune", "Nashik"],
      leadTime: "Dispatch within 36 hours",
    },
  },
  {
    id: "eq-concrete-batching-30",
    name: "30 m³/h Compact Batching Plant",
    slug: "compact-batching-plant-30",
    category: "Concrete",
    description:
      "Compact automatic batching plant with twin-shaft mixer suitable for high-volume pours in constrained sites.",
    highlight: "Integrated moisture correction and load-cell accuracy ±1%.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1100&q=80",
    specs: [
      { label: "Rated Output", value: "30 m³/h" },
      { label: "Mixer Type", value: "Twin-shaft" },
      { label: "Cement Silos", value: "2 x 50 tons" },
      { label: "Power Requirement", value: "75 kW" },
    ],
    pricing: {
      daily: 24500,
      weekly: 146000,
      monthly: 490000,
    },
    availability: {
      locations: ["Delhi NCR", "Jaipur", "Lucknow"],
      leadTime: "Dispatch within 48 hours",
    },
  },
  {
    id: "eq-gnss-rover",
    name: "Trimble R12i GNSS Rover",
    slug: "trimble-r12i-gnss-rover",
    category: "Surveying",
    description:
      "Survey-grade GNSS rover with ProPoint engine and tilt compensation for topo surveys and stakeout.",
    highlight: "IMU-based tilt compensation up to 60°, RTX ready.",
    image:
      "https://images.unsplash.com/photo-1523966211575-eb4a2e2520d6?auto=format&fit=crop&w=1100&q=80",
    specs: [
      { label: "RTK Accuracy", value: "8 mm + 1 ppm horizontal" },
      { label: "Inertial Tilt", value: "Up to 60°" },
      { label: "Battery", value: "10 h field runtime" },
      { label: "Comms", value: "UHF, 4G, Wi-Fi" },
    ],
    pricing: {
      daily: 9500,
      weekly: 54000,
      monthly: 178000,
    },
    availability: {
      locations: ["Hyderabad", "Bangalore", "Chennai"],
      leadTime: "Dispatch within 24 hours",
    },
  },
  {
    id: "eq-telehandler-17",
    name: "Manitou MT 1740 Telehandler",
    slug: "manitou-mt-1740-telehandler",
    category: "Material Handling",
    description:
      "17 m reach telehandler for high-rise material placement, formwork shifting, and rack servicing.",
    highlight: "360° visibility cabin with load-sensing hydraulics.",
    image:
      "https://images.unsplash.com/photo-1600359745066-c1243000d4d2?auto=format&fit=crop&w=1100&q=80",
    specs: [
      { label: "Max Lift Capacity", value: "4,000 kg" },
      { label: "Max Lift Height", value: "17.5 m" },
      { label: "Hydraulic Flow", value: "106 L/min" },
      { label: "Attachments", value: "Forks, jib, bucket" },
    ],
    pricing: {
      daily: 14500,
      weekly: 84000,
      monthly: 286000,
    },
    availability: {
      locations: ["Ahmedabad", "Surat", "Vadodara"],
      leadTime: "Dispatch within 30 hours",
    },
  },
  {
    id: "eq-soil-compactor",
    name: "Dynapac CA3500 Soil Compactor",
    slug: "dynapac-ca3500-soil-compactor",
    category: "Compaction",
    description:
      "14-ton padfoot compactor with Dynapac Active Bouncing Control for highways and embankments.",
    highlight: "Seismic smart compaction with live density reporting.",
    image:
      "https://images.unsplash.com/photo-1517289170542-bfb934ecdb0a?auto=format&fit=crop&w=1100&q=80",
    specs: [
      { label: "Operating Mass", value: "14,500 kg" },
      { label: "Drum Width", value: "2,130 mm" },
      { label: "Vibration Frequency", value: "30/34 Hz" },
      { label: "Amplitude", value: "1.9/0.95 mm" },
    ],
    pricing: {
      daily: 12500,
      weekly: 72000,
      monthly: 244000,
    },
    availability: {
      locations: ["Nagpur", "Indore", "Raipur"],
      leadTime: "Dispatch within 42 hours",
    },
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(equipments.map((equipment) => equipment.category))),
] as const;
