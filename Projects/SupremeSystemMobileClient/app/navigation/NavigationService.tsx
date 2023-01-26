import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
export const navigationRef = React.createRef<NavigationContainerRef>();

function Navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

function GoBack() {
  navigationRef.current?.goBack();
}

export {
  Navigate,
  GoBack,
};
