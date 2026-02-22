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

export async function fetchFooter() {
  try {
    const result = await Stack.ContentType("footer_v2").Entry("bltda90f941da9b637c").toJSON().fetch();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error fetching footer:", error);
  }
}

fetchFooter();
