/**
 * Type Definitions for electron-windows
 *
 * https://github.com/electron-modules/electron-windows
 */

import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

/**
 * The options used when creating a new window.
 */
interface ICreateOptions {
  /**
   * The name of the window. Default is `'anonymous'`.
   */
  name?: string
  /**
   * The loading view of the window.
   */
  loadingView?: { url?: string; [key: string]: any }
  /**
   * The options for the BrowserWindow. Same as Electron's `BrowserWindow` constructor options.
   */
  browserWindow?: BrowserWindowConstructorOptions
  /**
   * Whether to open DevTools. Default is false.
   */
  openDevTools?: boolean
  /**
   * Whether to prevent the origin close event. Default is false.
   */
  preventOriginClose?: boolean
  /**
   * Whether to prevent the origin navigate event. Default is false.
   */
  preventOriginNavigate?: boolean
  /**
   * The storage key for the window state. State management is based on `electron-window-state`.
   */
  storageKey?: string
  /**
   * The storage path for the window state. State management is based on `electron-window-state`.
   */
  storagePath?: string
  /**
   * The global user agent string used for window's `loadURL`.
   */
  globalUserAgent?: string

  // Allow other properties
  [key: string]: any
}

/**
 * Window enriched with state management features.
 */
interface StatefulWindow extends BrowserWindow {
  /**
   * The storage key for the window state. State management is based on `electron-window-state`.
   */
  storageKey?: string
  /**
   * The state from storage. State management is based on `electron-window-state`.
   */
  stateFromStorage?: {
    manage: (win: BrowserWindow) => void
    x?: number
    y?: number
    width?: number
    height?: number
    [key: string]: any
  }
  /**
   * (PRESERVED) Keeps the name of the window.
   */
  _name?: string
  /**
   * (PRESERVED) Keeps the very original `loadURL` method without UA modification.
   */
  _loadURL?: (url: string, options?: Electron.LoadURLOptions) => void // Added based on usage in _setGlobalUserAgent
}

/**
 * A union type of `StatefulWindow` and common `BrowserWindow`.
 */
type Window = StatefulWindow | BrowserWindow

/**
 * Manage multiple windows of Electron gracefully and provides powerful features.
 */
declare class WindowsManager {
  constructor(options?: Record<string, any>)

  /**
   * The options used when creating a new window.
   */
  _createOptions: ICreateOptions

  /**
   * The options used when `WindowsManager` is constructed.
   */
  options: Record<string, any>

  /**
   * The windows managed by the `WindowsManager`.
   */
  windows: { [id: number]: Window }

  /**
   * Creates a new window managed by the `WindowsManager`.
   * @param options Configuration options for the new window.
   * @returns The created `Window` instance (with added state properties if `storageKey` is provided).
   */
  create(options: ICreateOptions): Window

  /**
   * Retrieves a managed window by its assigned name.
   * @param name The name assigned to the window during creation.
   * @returns The found `Window` instance or undefined.
   */
  get(name: string): Window | undefined

  /**
   * Retrieves a managed window by its ID.
   * @param id The ID of the window.
   * @returns The found `Window` instance or undefined.
   */
  getById(id: number): Window | undefined

  /**
   * Retrieves all windows currently managed by this instance.
   * @returns An object where keys are window IDs and values are `Window` instances.
   */
  getAll(): { [id: number]: Window }

  /**
   * Clone a window.
   * @todo This is NOT IMPLEMENTED yet. Now it just returns the same window.
   * @param window The `Window` instance to clone.
   * @returns The cloned `Window` instance.
   */
  clone(window: Window): Window

  /**
   * The global user agent string.
   */
  static GLOBAL_USER_AGENT?: string

  /**
   * Sets a global user agent string to be used for all subsequent `loadURL` calls within managed windows.
   * @param ua The user agent string.
   */
  static setGlobalUserAgent(ua: string): void
}

export = WindowsManager
