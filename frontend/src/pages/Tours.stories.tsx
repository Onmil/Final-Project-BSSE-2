import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import ToursPage from "./Tours";

const meta: Meta<typeof ToursPage> = {
  title: "Pages/Tours",
  component: ToursPage,
};

export default meta;

type Story = StoryObj<typeof ToursPage>;

const mockOnBook = (item: any) => {
  console.log("BOOKING TRIGGERED:", item);
};

export const Default: Story = {
  args: {
    onBook: mockOnBook,
  },
};

export const TourBookingInteraction: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const bookButtons = await canvas.findAllByText("Book Now");
    await userEvent.click(bookButtons[0]);

    expect(bookButtons.length).toBeGreaterThan(0);
  },
};

export const OpenItineraryModal: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const itineraryButtons = await canvas.findAllByText("🗓 Itinerary");

    if (itineraryButtons.length > 0) {
      await userEvent.click(itineraryButtons[0]);
    }
  },
};

export const PackageInteraction: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const packageButtons = await canvas.findAllByText("Book Now");
    await userEvent.click(packageButtons[packageButtons.length - 1]);

    expect(packageButtons.length).toBeGreaterThan(0);
  },
};

export const VisualCheck: Story = {
  args: {
    onBook: mockOnBook,
  },
};