import contentstack from 'contentstack';
import fs from 'fs';

const envConfig = fs.readFileSync('.env', 'utf-8')
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...values] = line.split('=');
    acc[key.trim()] = values.join('=').trim().replace(/^['"]|['"]$/g, '');
    return acc;
  }, {});

const previewApiUrl = (envConfig.VITE_API_HOST || "")
  .replace("cdn", "rest-preview")
  .replace(".io", ".com");

const Stack = contentstack.Stack({
  api_key: envConfig.VITE_API_KEY,
  delivery_token: envConfig.VITE_DELIVERY_TOKEN,
  environment: envConfig.VITE_ENVIRONMENT,
  branch: "main",
  live_preview: {
    preview_token: envConfig.VITE_PREVIEW_TOKEN,
    enable: true,
    host: previewApiUrl,
  }
});

async function run() {
  try {
    const entry = await Stack.ContentType('about_page').Entry('blta52669d22cc684db').toJSON().fetch();
    fs.writeFileSync('about-page-response.json', JSON.stringify(entry, null, 4));
    console.log('Successfully wrote to about-page-response.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
