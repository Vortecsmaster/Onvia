import React from "react";
import { ProfileView } from "./ProfileView";
import { useProfileController } from "./useProfileController";
import { LoadingState } from "../../components/feedback/LoadingState";
export default function ProfileScreen() {
  const controller = useProfileController();
  if (!controller.profile) return <LoadingState />;
  return <ProfileView {...controller} profile={controller.profile} />;
}
