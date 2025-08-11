/**
 * @format
 */

import React from 'react';
import { test, expect } from '@jest/globals';

test('basic test', () => {
  expect(1 + 1).toBe(2);
});

test('React is available', () => {
  expect(React).toBeDefined();
});