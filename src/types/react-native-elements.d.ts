import 'react-native-elements';

declare module 'react-native-elements' {
  export interface CardProps {
    containerStyle?: any;
    wrapperStyle?: any;
    title?: string | React.ReactElement<{}>;
    titleStyle?: any;
    featuredTitle?: string;
    featuredTitleStyle?: any;
    featuredSubtitle?: string;
    featuredSubtitleStyle?: any;
    dividerStyle?: any;
    image?: any;
    imageStyle?: any;
    imageWrapperStyle?: any;
    imageProps?: any;
    children?: React.ReactNode;
  }
} 