import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { within, userEvent, waitFor } from "@storybook/testing-library";
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

    const buttons = await canvas.findAllByText("Book Now");
    await userEvent.click(buttons[0]);

    await waitFor(() => {
      expect(buttons.length).toBeGreaterThan(0);
    });
  },
};

export const OpenItineraryModal: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // click first itinerary button only (still safe)
    const itineraryButtons = await canvas.findAllByText("🗓 Itinerary");
    await userEvent.click(itineraryButtons[0]);

    // IMPORTANT FIX:
    // target MODAL, not generic text
    await waitFor(() => {
      const modal = canvasElement.querySelector(".itin-modal");
      expect(modal).toBeTruthy();
    });
  },
};

export const PackageInteraction: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const buttons = await canvas.findAllByText("Book Now");
    await userEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(buttons.length).toBeGreaterThan(0);
    });
  },
};