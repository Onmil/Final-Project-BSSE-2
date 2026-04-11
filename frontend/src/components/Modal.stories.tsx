import { on } from "events";
import Modal from "./Modal";

export default {
    title: "Components/Modal",
    component: Modal,
};

export const Login = {
    args: {
        type: "login",
        onClose: () => console.log("closed"),
        onSwitch: (type: string) => console.log("switch to", type),
        onSuccess: (user: any) => console.log("success", user),
    },
};

export const Signup = {
    args: {
        type: "signup",
        onClose: () => console.log("closed"),
        onSwitch: (type: string) => console.log("switch to", type),
        onSuccess: (user: any) => console.log("success", user),
    },
};

export const LoginWithErrors = {
    args: {
        type: "login",
        onClose: () => console.log("closed"),
        onSwitch: (type: string) => console.log("switch to", type),
        onSuccess: (user: any) => console.log("success", user),
    },
    play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;
    const submitBtn = canvas.querySelector('.modal-submit');
    submitBtn?.click();
  },
};

export const SignupWithErrors = {
  args: {
    type: 'signup',
    onClose: () => console.log('closed'),
    onSwitch: (type: string) => console.log('switched to', type),
    onSuccess: (user: any) => console.log('success', user),
  },
  play: async ({ canvasElement }: any) => {
    const canvas = canvasElement;
    const submitBtn = canvas.querySelector('.modal-submit');
    submitBtn?.click();
  },
};

export const LoginFailed = {
  beforeEach: () => {
    global.fetch = async () => ({
      ok: false,
      json: async () => ({ error: 'Invalid email or password.' }),
    } as Response);
  },
  args: {
    type: 'login',
    onClose: () => console.log('closed'),
    onSwitch: (type: string) => console.log('switched to', type),
    onSuccess: (user: any) => console.log('success', user),
  },
};

export const SignupEmailTaken = {
  beforeEach: () => {
    global.fetch = async () => ({
      ok: false,
      json: async () => ({ error: 'Email already in use.' }),
    } as Response);
  },
  args: {
    type: 'signup',
    onClose: () => console.log('closed'),
    onSwitch: (type: string) => console.log('switched to', type),
    onSuccess: (user: any) => console.log('success', user),
  },
};