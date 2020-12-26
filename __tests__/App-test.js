/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: jest.fn(),
    setUserProperties: jest.fn(),
    setUserId: jest.fn(),
    setCurrentScreen: jest.fn(),
  })
});

it('renders correctly', async () => {});
