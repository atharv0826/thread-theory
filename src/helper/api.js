import StackObj, { Stack } from "../sdk/entry";
import { addEditableTags } from "@contentstack/utils";

export const getHomePageRes = async (
  locale = null
) => {
  const response = (await StackObj.getEntry({
    contentTypeUid: "home_page",
    referenceFieldPath: [
      "page_sections.featured_products.products",
      "page_sections.collection_highlight.products"
    ],
    jsonRtePath: [
      "page_sections.image_text.description",
      "page_sections.collection_highlight.description"
    ],
    locale,
  }));
  
  if (response && response.length > 0) {
    // The query.find() method in this SDK version returns [[entry1, entry2,...], count]
    const entries = Array.isArray(response[0]) ? response[0] : response;
    
    if (entries && entries.length > 0) {
      const entry = entries[0];
      // Add editable tags for live preview / visual builder
      // locale must be a string, not null
      addEditableTags(entry, "home_page", true, locale || "en-us");
      return entry;
    }
  }
  
  return null;
};

export const getAboutPageRes = async (
  locale = null
) => {
  const response = (await StackObj.getEntry({
    contentTypeUid: "about_page",
    referenceFieldPath: [],
    jsonRtePath: [
      "page_components.widget.description"
    ],
    locale,
  }));
  
  if (response && response.length > 0) {
    const entries = Array.isArray(response[0]) ? response[0] : response;
    
    if (entries && entries.length > 0) {
      const entry = entries[0];
      // Add editable tags for live preview / visual builder
      addEditableTags(entry, "about_page", true, locale || "en-us");
      return entry;
    }
  }
  
  return null;
};

export const getHeaderRes = async (locale = null) => {
  try {
    const response = await StackObj.getEntryByUid({
      contentTypeUid: "header_v2",
      entryUid: import.meta.env.VITE_HEADER_V2_UID,
      referenceFieldPath: [],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "header_v2", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching universal Header v2:", error);
  }
  
  return null;
};

export const getProductRes = async (url, locale = null) => {
  try {
    const response = await StackObj.getEntryByUrl({
      contentTypeUid: "product",
      entryUrl: url,
      referenceFieldPath: ["related_products"],
      locale,
    });
      
    if (response) {
      // getEntryByUrl might return [[entry], count] or [entry] depending on the internal wrap.
      const entries = Array.isArray(response[0]) ? response[0] : (Array.isArray(response) ? response : [response]);
      const entry = entries?.[0];
      
      if (entry) {
        addEditableTags(entry, "product", true, locale || "en-us");
        return entry;
      }
    }
  } catch (error) {
    console.error("Error fetching individual product by slug:", error);
  }
  
  return null;
};

export const getFooterRes = async (locale = null) => {
  try {
    const response = await StackObj.getEntryByUid({
      contentTypeUid: "footer_v2",
      entryUid: import.meta.env.VITE_FOOTER_V2_UID,
      referenceFieldPath: [],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "footer_v2", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching universal Footer v2:", error);
  }
  
  return null;
};

export const getCollectionsRes = async (locale = null) => {
  try {
    const response = await StackObj.getEntryByUid({
      contentTypeUid: "collections",
      entryUid: import.meta.env.VITE_COLLECTIONS_UID,
      referenceFieldPath: ["reference"],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "collections", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching Collections layout:", error);
  }
  
  return null;
};

export const getCategoryRes = async (url, locale = null) => {
  try {
    const response = await Stack.ContentType('category')
      .Query()
      .where('url', url)
      .language(locale || 'en-us')
      .toJSON()
      .find();
      
    if (response && response.length > 0) {
      const entries = Array.isArray(response[0]) ? response[0] : response;
      const entry = entries?.[0];
      
      if (entry) {
        addEditableTags(entry, "category", true, locale || "en-us");
        return entry;
      }
    }
  } catch (error) {
    console.error("Error fetching category by url:", error);
  }
  
  return null;
};

export const getProductsByCategory = async (categoryUid, locale = null) => {
  try {
    const productQuery = Stack.ContentType("product").Query();
    
    // category field is an array of references, we must match the nested uid
    productQuery
      .where("category.uid", categoryUid)
      .language(locale || 'en-us')
      .includeReference("category");

    const response = await productQuery.toJSON().find();
    
    if (response && response.length > 0) {
      const entries = Array.isArray(response[0]) ? response[0] : response;
      if (entries && entries.length > 0) {
        entries.forEach(entry => {
           addEditableTags(entry, "product", true, locale || "en-us");
        });
        return entries;
      }
    }
  } catch (error) {
    console.error("Error fetching products by category UID:", error);
  }
  
  return [];
};

export const getPoliciesListingRes = async (locale = null) => {
  try {
    const response = await StackObj.getEntryByUid({
      contentTypeUid: "policies_listing_page",
      entryUid: import.meta.env.VITE_POLICIES_LISTING_UID,
      referenceFieldPath: ["policies"],
      jsonRtePath: [],
      locale,
    });

    if (response) {
      addEditableTags(response, "policies_listing_page", true, locale || "en-us");
      return response;
    }
  } catch (error) {
    console.error("Error fetching Policies Listing page:", error);
  }
  
  return null;
};

export const getPolicyRes = async (url, locale = null) => {
  try {
    const response = await StackObj.getEntryByUrl({
      contentTypeUid: "policy_page",
      entryUrl: url,
      referenceFieldPath: [],
      jsonRtePath: [
        "body_sections.rich_text_section.body"
      ],
      locale,
    });
      
    if (response) {
      const entries = Array.isArray(response[0]) ? response[0] : (Array.isArray(response) ? response : [response]);
      const entry = entries?.[0];
      
      if (entry) {
        addEditableTags(entry, "policy_page", true, locale || "en-us");
        return entry;
      }
    }
  } catch (error) {
    console.error("Error fetching individual policy by url:", error);
  }
  
  return null;
};
