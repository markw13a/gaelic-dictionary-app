import analytics from '@react-native-firebase/analytics';

export const logAnalyticsEvent = (eventName, payload) => analytics().logEvent(eventName, payload);
