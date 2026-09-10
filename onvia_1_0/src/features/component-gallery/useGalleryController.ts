import { useEffect, useRef, useState } from "react";
import { LocalDateTime } from "../../domain/models";
import { useNotify } from "../../providers/FeedbackProvider";
import { t } from "../../locales";
export function useGalleryController() {
  const notify = useNotify();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [text, setText] = useState(""),
    [longText, setLongText] = useState(""),
    [option, setOption] = useState<string | null>(null),
    [checked, setChecked] = useState(false),
    [enabled, setEnabled] = useState(false),
    [radio, setRadio] = useState<string | null>(null),
    [date, setDate] = useState<string | null>(null),
    [time, setTime] = useState<string | null>("13:30"),
    [datetime, setDatetime] = useState<LocalDateTime | null>(null),
    [refreshing, setRefreshing] = useState(false);
  useEffect(
    () => () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    },
    [],
  );
  return {
    text,
    setText,
    longText,
    setLongText,
    option,
    setOption,
    checked,
    setChecked,
    enabled,
    setEnabled,
    radio,
    setRadio,
    date,
    setDate,
    time,
    setTime,
    datetime,
    setDatetime,
    refreshing,
    refresh: () => {
      setRefreshing(true);
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        refreshTimer.current = null;
        setRefreshing(false);
      }, 600);
    },
    action: () => notify(t("gallery.action")),
  };
}
