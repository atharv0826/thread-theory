import contentstack from 'contentstack';

const Stack = contentstack.Stack({
  api_key: process.env.VITE_API_KEY,
  delivery_token: process.env.VITE_DELIVERY_TOKEN,
  environment: process.env.VITE_ENVIRONMENT,
  branch: process.env.VITE_BRANCH || "main",
});

if (process.env.VITE_API_HOST) {
  Stack.setHost(process.env.VITE_API_HOST);
}

export async function fetchCollections() {
  try {
    // The field containing categories is literally named "reference" based on the first dump
    const result = await Stack.ContentType("collections").Entry("blt7de23544cd2404d7").includeReference(['reference']).toJSON().fetch();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error fetching collections:", error);
  }
}

fetchCollections();
