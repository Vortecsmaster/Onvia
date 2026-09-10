import { useRecordsController } from "../shared/useRecordsController";
export const useClinicalHistoryController = () =>
  useRecordsController("history");
