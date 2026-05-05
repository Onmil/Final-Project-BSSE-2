import type { Meta, StoryObj } from "@storybook/react-webpack5";
import DestinationsPage from "./Destinations";

const mockBookings = (data: any[] = [], error: any = null) => {
  (window as any).__SUPABASE_MOCK__ = {
    data,
    error,
  };
};

const meta: Meta<typeof DestinationsPage> = {
  title: "Pages/Destinations",
  component: DestinationsPage,
};

export default meta;

type Story = StoryObj<typeof DestinationsPage>;

/* ---------------- EMPTY STATE ---------------- */
export const EmptyState: Story = {
  args: {
    userId: "user-123",
    refreshKey: 1,
  },
  decorators: [
    (Story) => {
      mockBookings([]);
      return <Story />;
    },
  ],
};

/* ---------------- LOADING STATE ---------------- */
export const LoadingState: Story = {
  args: {
    userId: null,
    refreshKey: 0,
  },
  decorators: [
    (Story) => {
      (window as any).__SUPABASE_MOCK__ = null;
      return <Story />;
    },
  ],
};

/* ---------------- WITH BOOKINGS ---------------- */
export const WithBookings: Story = {
  args: {
    userId: "user-123",
    refreshKey: 1,
  },
  decorators: [
    (Story) => {
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
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 500));

    const canvas = canvasElement;

    const btn = canvas.querySelector(".dest-itinerary-btn") as HTMLButtonElement;
    btn?.click();

    await new Promise((r) => setTimeout(r, 500));

    const modal = canvas.querySelector(".itin-modal-title");
    if (!modal) throw new Error("Itinerary modal did not open");

    const closeBtn = canvas.querySelector(".itin-close-btn") as HTMLButtonElement;
    closeBtn?.click();
  },
};