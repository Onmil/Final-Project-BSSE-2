import Bookingform from "./Bookingform";
import { Tour, TourSchedule } from "../types";
import guim from "../assets/images/guim_2k.jpg";

export default {
    title: "Components/Bookingform",
    component: Bookingform,
};

const mockFetch = (success: boolean = true) => {
  global.fetch = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    if (success) {
      return {
        ok: true,
        json: async () => ({ id: 'mock-booking-123' }),
      } as Response;
    } else {
      return {
        ok: false,
        json: async () => ({ error: 'Payment declined' }),
      } as Response;
    }
  };
};

const mockTour: Tour = {
    id: 1,
    name: "Guimaras",
    price: "2,500",
    image: guim,
};
   
const mockSchedules: TourSchedule = {
    "Guimaras": [
        { date: "2026-06-01", spotsLeft: 40 },
        { date: "2026-06-08", spotsLeft: 40 },
        { date: "2026-06-15", spotsLeft: 40 },
    ]
};

export const Default = {
    args: {
        tour: mockTour,
        schedules: mockSchedules,
        userUuid: "test-user-123",
        onClose: () => console.log("closed"),
        onConfirm: (booking: any) => console.log("booking confirmed", booking),
        onGoToDestinations: () => console.log("go to destinations"),
    },
};

export const NoSchedules = {
    args: {
        tour: mockTour,
        schedules: {},
        userUuid: "test-user-123",
        onClose: () => console.log("closed"),
        onConfirm: (booking: any) => console.log("booking confirmed", booking),
        onGoToDestinations: () => console.log("go to destinations"),
    },
};

export const FullyBooked = {
    args: {
        tour: mockTour,
        schedules: {
            "Guimaras": [
                { date: "2026-06-01", spotsLeft: 0 },
                { date: "2026-06-08", spotsLeft: 0 },
                { date: "2026-06-15", spotsLeft: 0 },
            ]
        },
        userUuid: "test-user-123",
        onClose: () => console.log("closed"),
        onConfirm: (booking: any) => console.log("booking confirmed", booking),
        onGoToDestinations: () => console.log("go to destinations"),
    },
};

export const PaymentSuccess = {
  beforeEach: () => {
    mockFetch(true);
  },
  args: {
    tour: mockTour,
    schedules: mockSchedules,
    userUuid: 'test-user-123',
    onClose: () => console.log('closed'),
    onConfirm: (booking: any) => console.log('confirmed', booking),
    onGoToDestinations: () => console.log('go to destinations'),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;

    const setNativeValue = (element: any, value: string) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;
      nativeInputValueSetter?.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const setNativeSelect = (element: any, value: string) => {
      const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype, 'value'
      )?.set;
      nativeSelectValueSetter?.call(element, value);
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    await new Promise((r) => setTimeout(r, 300));

    const fullName = canvas.querySelector('#fullName');
    setNativeValue(fullName, 'Peter Parker');

    await new Promise((r) => setTimeout(r, 300));

    const email = canvas.querySelector('#email');
    setNativeValue(email, 'peterparker@gmail.com');

    await new Promise((r) => setTimeout(r, 300));

    const phone = canvas.querySelector('#phone');
    setNativeValue(phone, '09123456789');

    await new Promise((r) => setTimeout(r, 300));

    const date = canvas.querySelector('#date');
    setNativeSelect(date, '2026-06-01');

    await new Promise((r) => setTimeout(r, 500));

    const submitBtn = canvas.querySelector('.bf-submit');
    submitBtn?.click();

    await new Promise((r) => setTimeout(r, 500));

    const gcashBtn = canvas.querySelector('.bf-payment-option');
    gcashBtn?.click();

    await new Promise((r) => setTimeout(r, 500));

    const payBtn = canvas.querySelector('.bf-submit');
    payBtn?.click();
  },
};

export const PaymentFailed = {
  beforeEach: () => {
    mockFetch(false);
  },
  args: {
    tour: mockTour,
    schedules: mockSchedules,
    userUuid: 'test-user-123',
    onClose: () => console.log('closed'),
    onConfirm: (booking: any) => console.log('confirmed', booking),
    onGoToDestinations: () => console.log('go to destinations'),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;

    const setNativeValue = (element: any, value: string) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;
      nativeInputValueSetter?.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const setNativeSelect = (element: any, value: string) => {
      const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype, 'value'
      )?.set;
      nativeSelectValueSetter?.call(element, value);
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    await new Promise((r) => setTimeout(r, 300));

    const fullName = canvas.querySelector('#fullName');
    setNativeValue(fullName, 'Peter Parker');

    await new Promise((r) => setTimeout(r, 300));

    const email = canvas.querySelector('#email');
    setNativeValue(email, 'peterparker@gmail.com');

    await new Promise((r) => setTimeout(r, 300));

    const phone = canvas.querySelector('#phone');
    setNativeValue(phone, '09123456789');

    await new Promise((r) => setTimeout(r, 300));

    const date = canvas.querySelector('#date');
    setNativeSelect(date, '2026-06-01');

    await new Promise((r) => setTimeout(r, 500));

    const submitBtn = canvas.querySelector('.bf-submit');
    submitBtn?.click();

    await new Promise((r) => setTimeout(r, 500));

    const cardBtn = canvas.querySelectorAll('.bf-payment-option')[2];
    cardBtn?.click();

    await new Promise((r) => setTimeout(r, 500));

    const payBtn = canvas.querySelector('.bf-submit');
    payBtn?.click();

    await new Promise((r) => setTimeout(r, 1500));
  },
};

export const NoTourImage = {
  args: {
    tour: {
      ...mockTour,
      image: undefined,
    },
    schedules: mockSchedules,
    userUuid: 'test-user-123',
    onClose: () => console.log('closed'),
    onConfirm: (booking: any) => console.log('confirmed', booking),
    onGoToDestinations: () => console.log('go to destinations'),
  },
};