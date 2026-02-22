import contentstack from "contentstack";
import * as Utils from "@contentstack/utils";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const config = {
  API_KEY: import.meta.env.VITE_API_KEY,
  DELIVERY_TOKEN: import.meta.env.VITE_DELIVERY_TOKEN,
  PREVIEW_TOKEN: import.meta.env.VITE_PREVIEW_TOKEN,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
  API_HOST: import.meta.env.VITE_API_HOST,
  APP_HOST: import.meta.env.VITE_APP_HOST,
};

const previewApiUrl = (config.API_HOST || "")
  .replace("cdn", "rest-preview")
  .replace(".io", ".com");

export const Stack = contentstack.Stack({
  api_key: config.API_KEY,
  delivery_token: config.DELIVERY_TOKEN,
  environment: config.ENVIRONMENT,
  branch: "main",
  live_preview: {
    preview_token: config.PREVIEW_TOKEN ? config.PREVIEW_TOKEN : "",
    enable: true,
    host: previewApiUrl ? previewApiUrl : "",
  },
});

/**
 * initialize live preview
 */

const appURL = new URL(config.APP_HOST || "http://localhost:5173");

ContentstackLivePreview.init({
  enable: true,
  mode: "builder",
  stackSdk: Stack,
  clientUrlParams: {
    host: appURL.hostname,
    port: appURL.port,
    protocol: appURL.protocol.split(":")[0],
  },
  stackDetails: {
    apiKey: config.API_KEY,
  },
  ssr: false,
});

if (config.API_HOST) {
  Stack.setHost(config.API_HOST);
}

const renderOption = {
  span: (node, next) => {
    return next(node.children);
  },
};

export const onEntryChange = ContentstackLivePreview.onEntryChange;

export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({
    contentTypeUid,
    referenceFieldPath,
    jsonRtePath,
    locale,
  }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      if (locale) query.language(locale);
      query
        .includeFallback()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          },
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
    locale,
    includeAll = false,
  }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      if (locale) query.language(locale);
      if (includeAll) {
        query.addQuery("include_all", "true");
        query.addQuery("include_all_depth", "2");
      }
      query
        .addQuery("include_applied_variants", "true")
        .includeFallback()
        .toJSON();
      const data = query.where("url", `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },

  /**
   *fetches specific entry from a content-type by UID
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* entry uid} entryUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUid({
    contentTypeUid,
    entryUid,
    referenceFieldPath,
    jsonRtePath,
    locale,
  }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Entry(entryUid);
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      if (locale) query.language(locale);
      
      query.includeFallback().toJSON();
      
      query.fetch().then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};
