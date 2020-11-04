// These flags are defined in webpack.config.js
// and configured on the command line

/* eslint-disable-next-line no-undef */
export const isInstrumentationEnabled = () => INSTRUMENTATION

/* eslint-disable-next-line no-undef */
export const isRandomEnabled = () => RANDOM

/* eslint-disable-next-line no-undef */
export const prioritizedLanguageListName = TARGET_STORE

/* eslint-disable-next-line no-undef */
export const isRequestHeaderDisabled = () => DISABLE_REQUEST_HEADER
