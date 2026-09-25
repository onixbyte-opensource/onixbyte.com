/**
 * Type of the project's `i18n.json`, for use with `useI18n()`.
 *
 * `useI18n<T>()` is generic over the keys *beyond* Rspress's built-in set:
 *
 *   useI18n<T>(): (key: keyof (T & I18nText), params?) => string
 *
 * Without a type argument, `T` defaults to `unknown` and only the built-in keys
 * type-check — looking up one of our own keys (`footer.copyright`, say) is then
 * an error. Passing this type fixes that for every key in `i18n.json`, and stays
 * correct automatically as keys are added.
 *
 * `typeof import(...)` is a type-level import, so this costs nothing at runtime
 * and the JSON is not pulled into the client bundle.
 */
export type CustomI18n = typeof import("../../i18n.json")
