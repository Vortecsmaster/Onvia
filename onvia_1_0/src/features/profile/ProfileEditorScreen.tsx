import React from "react";
import { ProfileEditorView } from "./ProfileEditorView";
import { useProfileEditorController } from "./useProfileEditorController";
export default function ProfileEditorScreen() {
  return <ProfileEditorView {...useProfileEditorController()} />;
}
