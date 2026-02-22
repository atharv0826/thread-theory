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

export async function fetchProductByUrl(url = "/products/linen-shirt") {
  try {
    const result = await Stack.ContentType("product")
      .Query()
      .where("url", url)
      .language("en-us")
      .toJSON()
      .find();

    console.log(JSON.stringify(result?.[0]?.[0] || null, null, 2));
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

fetchProductByUrl();
