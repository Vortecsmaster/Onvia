import { appConfig } from "../../config/app";
export function useAboutController() {
  return {
    name: appConfig.name,
    version: appConfig.version,
    event: appConfig.event,
    team: appConfig.team,
  };
}
