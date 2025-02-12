import { createRouter, createWebHistory } from "vue-router";
import MessageCapsuleList from "@/components/MessageCapsuleList.vue";
import MessageCapsuleForm from "@/components/MessageCapsuleForm.vue";
import Login from "@/components/Login.vue";
import Register from "../components/Register.vue";

const routes = [
    { path: "/", component: MessageCapsuleList },
    { path: "/create", component: MessageCapsuleForm },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/:catchAll(.*)", redirect: "/" },

];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;