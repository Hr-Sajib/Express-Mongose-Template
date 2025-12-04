import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AccountRoutes } from "../modules/account/account.route";
import { MeetingRoutes } from "../modules/meeting/meeting.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/account",
    route: AccountRoutes,
  },
  {
    path: "/meeting",
    route: MeetingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
