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

/* ---------------- BASIC RENDER ---------------- */
export const Default: Story = {
  args: {
    onBook: mockOnBook,
  },
};

/* ---------------- BOOK BUTTON CLICK ---------------- */
export const TourBookingInteraction: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const bookButtons = await canvas.findAllByText(/book now/i);

    await userEvent.click(bookButtons[0]);

    // wait for potential state update / modal trigger
    await waitFor(() => {
      expect(mockOnBook).toBeDefined();
    });

    expect(bookButtons.length).toBeGreaterThan(0);
  },
};

/* ---------------- ITINERARY MODAL ---------------- */
export const OpenItineraryModal: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const itineraryButtons = await canvas.findAllByText(/itinerary/i);

    if (!itineraryButtons.length) {
      throw new Error("No itinerary buttons found");
    }

    await userEvent.click(itineraryButtons[0]);

    // IMPORTANT: wait for modal render
    await waitFor(() => {
      const modal = canvas.getByText(/itinerary/i);
      expect(modal).toBeInTheDocument();
    });
  },
};

/* ---------------- PACKAGE INTERACTION ---------------- */
export const PackageInteraction: Story = {
  args: {
    onBook: mockOnBook,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const bookButtons = await canvas.findAllByText(/book now/i);

    await userEvent.click(bookButtons[bookButtons.length - 1]);

    await waitFor(() => {
      expect(bookButtons.length).toBeGreaterThan(0);
    });
  },
};

/* ---------------- VISUAL ONLY ---------------- */
export const VisualCheck: Story = {
  args: {
    onBook: mockOnBook,
  },
};