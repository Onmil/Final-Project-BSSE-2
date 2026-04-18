import type { Meta, StoryObj } from "@storybook/react-webpack5";
import LandingPage from "./LandingPage";

const meta: Meta<typeof LandingPage> = {
  title: "Pages/LandingPage",
  component: LandingPage,
};

export default meta;

type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {};