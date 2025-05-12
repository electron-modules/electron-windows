// @ts-check
import { test, expect, _electron as electron } from '@playwright/test';
import { last as _last } from 'lodash';
import * as path from 'path';

const wait = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gets the last element of array.
 * @template T
 * @param {T[] | null | undefined} arr
 * @returns {T}
 */
const last = (arr) => {
  const lastElement = _last(arr);
  expect(lastElement).not.toBeUndefined();
  // @ts-ignore
  return lastElement;
};

test.describe('test/e2e/electron-windows.e2e.test.js', () => {
  /** @type { import('@playwright/test').ElectronApplication } */
  let electronApp;

  test.beforeEach(async () => {
    electronApp = await electron.launch({ args: ['start.js'], cwd: path.join(__dirname, '../..') });
  });

  test('loadingView option is working', async () => {
    const window = await electronApp.firstWindow();

    expect(await window.title()).toBe('Loading');
    expect(window.url()).toMatch(/renderer\/loading\.html$/);
  });

  test('new window can be correctly created', async () => {
    await wait();
    const window = await electronApp.firstWindow();
    await window.click('button#new');
    await wait();
    const windows = electronApp.windows();

    expect(windows.length).toBeGreaterThan(1);
    expect(last(windows).url()).toMatch(/renderer\/window\.html$/);
  });

  test('new online window can be correctly created', async () => {
    await wait();
    const window = await electronApp.firstWindow();
    await window.click('button#new-online');
    await wait();
    const windows = electronApp.windows();

    expect(windows.length).toBeGreaterThan(1);
    expect(last(windows).url()).toMatch(/https(.+)?github\.com/);
  });

  test('window can be correctly closed', async () => {
    await wait();
    const window = await electronApp.firstWindow();
    await window.click('button#new');
    await wait();
    const newWindow = last(electronApp.windows());
    await newWindow.click('button#close');
    await wait();
    const windows = electronApp.windows();

    expect(windows).toHaveLength(1);
    expect(await windows[0].title()).toBe('main');
  });

  test.afterEach(async () => {
    await electronApp?.close();
    // @ts-ignore
    electronApp = null;
  });
});
