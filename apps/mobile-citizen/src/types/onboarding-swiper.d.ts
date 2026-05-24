declare module "react-native-onboarding-swiper" {
  import type { ComponentType } from "react";
  import type { ImageSourcePropType, TextStyle, ViewStyle } from "react-native";

  export interface Page {
    backgroundColor: string;
    image: React.ReactElement;
    title: string;
    subtitle: string;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  export interface OnboardingProps {
    pages: Page[];
    onDone?: () => void;
    onSkip?: () => void;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    bottomBarHighlight?: boolean;
    bottomBarColor?: string;
    controlStatusBar?: boolean;
    skipLabel?: string;
    nextLabel?: string;
    doneLabel?: string;
    containerStyles?: ViewStyle;
    imageContainerStyles?: ViewStyle;
  }

  const Onboarding: ComponentType<OnboardingProps>;
  export default Onboarding;
}
