import type { Meta, StoryObj } from "@storybook/react-webpack5";
import DestinationsPage from "./Destinations";
import * as supabaseClient from "../supabaseClient";

const mockBookings = (data: any[], error: any = null) => {
  (supabaseClient as any).supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data, error }),
        }),
      }),
    }),
  };
};

const meta: Meta<typeof DestinationsPage> = {
  title: "Pages/Destinations",
  component: DestinationsPage,
};

export default meta;

type Story = StoryObj<typeof DestinationsPage>;

export const EmptyState: Story = {
  args: {
    userId: "user-123",
    refreshKey: 0,
  },
  play: async () => {
    mockBookings([]);
  },
};

export const LoadingState: Story = {
  args: {
    userId: null,
    refreshKey: 0,
  },
};

export const WithBookings: Story = {
  args: {
    userId: "user-123",
    refreshKey: 1,
  },
  play: async ({ canvasElement }: any) => {
    mockBookings([
      {
        id: 1,
        tour_id: 1,
        booking_date: "2026-06-01",
        status: "confirmed",
        full_name: "Peter Parker",
        email: "peter@web.com",
        phone: "09123456789",
        persons: 2,
        user_id: "user-123",
        payment_method: "gcash",
      },
    ]);

    await new Promise((r) => setTimeout(r, 300));

    const canvas = canvasElement;

    const itineraryBtn = canvas.querySelector(".dest-itinerary-btn") as HTMLButtonElement;
    itineraryBtn?.click();

    await new Promise((r) => setTimeout(r, 500));

    const modalTitle = canvas.querySelector(".itin-modal-title");
    if (!modalTitle) throw new Error("Itinerary modal did not open");

    const closeBtn = canvas.querySelector(".itin-close-btn") as HTMLButtonElement;
    closeBtn?.click();
  },
};

export const MultiBookingInteraction: Story = {
  args: {
    userId: "user-123",
    refreshKey: 2,
  },
  play: async ({ canvasElement }: any) => {
    mockBookings([
      {
        id: 1,
        tour_id: 1,
        booking_date: "2026-06-01",
        status: "confirmed",
        full_name: "Peter Parker",
        email: "peter@web.com",
        phone: "09123456789",
        persons: 2,
        user_id: "user-123",
        payment_method: "gcash",
      },
      {
        id: 2,
        tour_id: 2,
        booking_date: "2026-06-10",
        status: "pending",
        full_name: "Tony Stark",
        email: "tony@stark.com",
        phone: "09998887766",
        persons: 1,
        user_id: "user-123",
        payment_method: "card",
      },
    ]);

    await new Promise((r) => setTimeout(r, 300));

    const canvas = canvasElement;

    const buttons = canvas.querySelectorAll(".dest-itinerary-btn");

    if (buttons.length < 2) {
      throw new Error("Expected multiple itinerary buttons");
    }

    (buttons[0] as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 400));

    const closeBtn = canvas.querySelector(".itin-close-btn") as HTMLButtonElement;
    closeBtn?.click();

    await new Promise((r) => setTimeout(r, 400));

    (buttons[1] as HTMLButtonElement).click();

    await new Promise((r) => setTimeout(r, 400));

    const modalTitle = canvas.querySelector(".itin-modal-title");
    if (!modalTitle) throw new Error("Second itinerary failed to open");
  },
};

export const ErrorState: Story = {
  args: {
    userId: "user-123",
    refreshKey: 3,
  },
  play: async () => {
    mockBookings([], { message: "Supabase failure" });
  },
};