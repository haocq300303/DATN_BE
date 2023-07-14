import routerPermission from "./permission.router";
import routerBanner from "./banner.router";

export const configRouter = (app) => {
  app.use("/api/permissions", routerPermission);
  app.use("/api/banners", routerBanner);
};
