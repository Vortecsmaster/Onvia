import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "../primitives/Icon";
import { theme } from "../../theme";
import { t } from "../../locales";

const SHOW_TOP_THRESHOLD = 480;
const FADE_RANGE = 36;
const ivory = theme.colors.background;
const ivoryClear = "#FAF8F100";

export type ScrollAreaHandle = {
  scrollTo: (options: { y: number; animated?: boolean }) => void;
  scrollToEnd: (options?: { animated?: boolean }) => void;
};

export type ScrollAreaProps = {
  children: React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showProgress?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  stickyHeaderIndices?: number[];
  safeBottom?: boolean;
  bottomInset?: number;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export const ScrollArea = forwardRef<ScrollAreaHandle, ScrollAreaProps>(
  function ScrollArea(
    {
      children,
      testID,
      style,
      contentContainerStyle,
      showProgress = false,
      onRefresh,
      refreshing = false,
      stickyHeaderIndices,
      safeBottom = false,
      bottomInset = 0,
      onScroll,
    },
    ref,
  ) {
    const insets = useSafeAreaInsets();
    const scrollRef = useRef<ScrollView>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showToTop, setShowToTop] = useState(false);
    const [maxScroll, setMaxScroll] = useState(1);
    const metrics = useRef({ content: 1, viewport: 1 });

    const updateExtent = useCallback((content: number, viewport: number) => {
      metrics.current = { content, viewport };
      setMaxScroll(Math.max(1, content - viewport));
    }, []);

    useImperativeHandle(ref, () => ({
      scrollTo: (options) => scrollRef.current?.scrollTo(options),
      scrollToEnd: (options) => scrollRef.current?.scrollToEnd(options),
    }));

    const handleScroll = useMemo(
      () =>
        Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
          listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            setShowToTop(
              event.nativeEvent.contentOffset.y >= SHOW_TOP_THRESHOLD,
            );
            onScroll?.(event);
          },
        }),
      [onScroll, scrollY],
    );

    const topFade = scrollY.interpolate({
      inputRange: [0, FADE_RANGE],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    const bottomFade = scrollY.interpolate({
      inputRange: [Math.max(0, maxScroll - FADE_RANGE), maxScroll],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const progressScale = scrollY.interpolate({
      inputRange: [0, maxScroll],
      outputRange: [0.04, 1],
      extrapolate: "clamp",
    });
    const toTopMotion = scrollY.interpolate({
      inputRange: [SHOW_TOP_THRESHOLD - 80, SHOW_TOP_THRESHOLD],
      outputRange: [0.86, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={[{ flex: 1, backgroundColor: ivory }, style]}>
        {showProgress && (
          <View
            pointerEvents="none"
            style={{
              height: 3,
              backgroundColor: theme.colors.sand,
              overflow: "hidden",
            }}
          >
            <Animated.View
              testID={testID ? `${testID}-progress` : undefined}
              style={{
                height: 3,
                width: "100%",
                backgroundColor: theme.colors.primary,
                transform: [{ scaleX: progressScale }],
                transformOrigin: "left center",
              }}
            />
          </View>
        )}
        <Animated.ScrollView
          ref={scrollRef}
          testID={testID}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          stickyHeaderIndices={stickyHeaderIndices}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
                title={t("scroll.refresh")}
                accessibilityLabel={t("scroll.refresh")}
              />
            ) : undefined
          }
          onContentSizeChange={(_, height) =>
            updateExtent(height, metrics.current.viewport)
          }
          onLayout={(event: LayoutChangeEvent) =>
            updateExtent(
              metrics.current.content,
              event.nativeEvent.layout.height,
            )
          }
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingBottom: bottomInset + (safeBottom ? insets.bottom : 0),
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </Animated.ScrollView>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: showProgress ? 3 : 0,
            left: 0,
            right: 0,
            height: 32,
            opacity: topFade,
          }}
        >
          <LinearGradient colors={[ivory, ivoryClear]} style={{ flex: 1 }} />
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            opacity: bottomFade,
          }}
        >
          <LinearGradient colors={[ivoryClear, ivory]} style={{ flex: 1 }} />
        </Animated.View>
        {showToTop && (
          <Animated.View
            style={{
              position: "absolute",
              right: 18,
              bottom: 22 + (safeBottom ? insets.bottom : 0),
              opacity: toTopMotion,
              transform: [{ scale: toTopMotion }],
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("scroll.toTop")}
              onPress={() =>
                scrollRef.current?.scrollTo({ y: 0, animated: true })
              }
              style={({ pressed }) => ({
                minWidth: 48,
                minHeight: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.primary,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.82 : 1,
                shadowColor: theme.colors.primary,
                shadowOpacity: 0.28,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4,
              })}
            >
              <Icon name="chevron-up" size={20} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </View>
    );
  },
);
