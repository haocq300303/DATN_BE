import routerPermission from "./permission.router";

export const configRouter = (app) => {
  app.use("/api/permissions", routerPermission);
};
