import type { Meta, StoryObj } from "@storybook/react-webpack5";
import Tours from "./Tours";

const meta: Meta<typeof Tours> = {
  title: "Pages/Tours",
  component: Tours,
};

export default meta;

type Story = StoryObj<typeof Tours>;

export const Default: Story = {};