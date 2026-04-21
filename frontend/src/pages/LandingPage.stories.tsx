import type { Meta, StoryObj } from "@storybook/react-webpack5";
import LandingPage from "./LandingPage";

const meta: Meta<typeof LandingPage> = {
  title: "Pages/LandingPage",
  component: LandingPage,
};

export default meta;

type Story = StoryObj<typeof LandingPage>;

const mockOnExplore = () => {
  console.log("Explore clicked → navigating to tours page");
};

// Base state (normal render)
export const Default: Story = {
  args: {
    onExplore: mockOnExplore,
  },
};

// Simulated user interaction: search + select suggestion
export const SearchAndSelect: Story = {
  args: {
    onExplore: mockOnExplore,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;

    const setNativeValue = (el: HTMLInputElement, value: string) => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      setter?.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };

    await new Promise((r) => setTimeout(r, 300));

    const input = canvas.querySelector("input") as HTMLInputElement;
    setNativeValue(input, "bo");

    await new Promise((r) => setTimeout(r, 600));

    const firstSuggestion = canvas.querySelector(
      ".search-suggestions li"
    ) as HTMLLIElement;

    firstSuggestion?.click();

    await new Promise((r) => setTimeout(r, 500));
  },
};

// Card switching interaction test
export const CardSwapInteraction: Story = {
  args: {
    onExplore: mockOnExplore,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;

    await new Promise((r) => setTimeout(r, 300));

    const cards = canvas.querySelectorAll(".swap-card");

    // click middle card to change active slot
    (cards[1] as HTMLDivElement)?.click();

    await new Promise((r) => setTimeout(r, 400));

    // click active card again to trigger swap
    (cards[1] as HTMLDivElement)?.click();

    await new Promise((r) => setTimeout(r, 400));
  },
};

// Explore button test
export const ExploreButton: Story = {
  args: {
    onExplore: mockOnExplore,
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;

    await new Promise((r) => setTimeout(r, 300));

    const btn = canvas.querySelector(".explore-btn") as HTMLButtonElement;
    btn?.click();
  },
};