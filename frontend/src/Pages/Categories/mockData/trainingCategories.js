import {
  FitnessCenter,
  DirectionsRun,
  Healing,
  AccessibilityNew,
  Repeat,
} from "@mui/icons-material";
import { tokens } from "../../theme";

const colors = tokens("light");

export const trainingCategories = [
  {
    id: 1,
    name: "Track Training",
    description: "Enhance your endurance and speed on the track.",
    icon: (
      <DirectionsRun
        style={{ color: colors.secondary.main, fontSize: "50px" }}
      />
    ),
  },
  {
    id: 2,
    name: "Gym Training",
    description: "Build strength and muscle with gym equipment.",
    icon: (
      <FitnessCenter
        style={{ color: colors.secondary.main, fontSize: "50px" }}
      />
    ),
  },
  {
    id: 3,
    name: "Prevention Workout",
    description: "Focus on injury prevention and recovery.",
    icon: (
      <Healing style={{ color: colors.secondary.main, fontSize: "50px" }} />
    ),
  },
  {
    id: 4,
    name: "Core Workout",
    description: "Strengthen your core for better stability.",
    icon: (
      <AccessibilityNew
        style={{ color: colors.secondary.main, fontSize: "50px" }}
      />
    ),
  },
  {
    id: 5,
    name: "Mobility Workout",
    description: "Improve flexibility and range of motion.",
    icon: <Repeat style={{ color: colors.secondary.main, fontSize: "50px" }} />,
  },
];
