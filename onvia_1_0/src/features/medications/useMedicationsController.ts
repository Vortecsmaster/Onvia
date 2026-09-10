import { useRecordsController } from "../shared/useRecordsController";
export const useMedicationsController = () =>
  useRecordsController("medications");
