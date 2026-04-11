import Navbar from "./Navbar";

export default {
    title: "Components/Navbar",
    component: Navbar,
};

export const LoggedOut = {
    args: {
        currentPage: "home",
        user: null,
    },
};

export const LoggedIn = {
    args: {
        currentPage: "home",
        user: { id: "123", name: "Bruce Wayne", email: "bruce.wayne2@gmail.com"}
    }
}