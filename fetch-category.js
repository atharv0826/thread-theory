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

export async function testQuery() {
  try {
    const categoryUid = "bltf441feed5785bf2d";
    const productQuery = Stack.ContentType("product").Query();
    
    // Testing the array query syntax for reference fields
    productQuery
      .where("category", categoryUid)
      .includeReference("category");

    const productRes = await productQuery.toJSON().find();
    console.log("Syntax 1 - where('category', uid):", productRes[0]?.length, "products");
    
    const productQuery2 = Stack.ContentType("product").Query();
    // Testing the nested UID syntax
    productQuery2
      .where("category.uid", categoryUid)
      .includeReference("category");

    const productRes2 = await productQuery2.toJSON().find();
    console.log("Syntax 2 - where('category.uid', uid):", productRes2[0]?.length, "products");
    
  } catch (error) {
    console.error("Error:", error);
  }
}

testQuery();
