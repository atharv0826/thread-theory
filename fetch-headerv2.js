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

const Stack = contentstack.Stack({
  api_key: envConfig.VITE_API_KEY,
  delivery_token: envConfig.VITE_DELIVERY_TOKEN,
  environment: envConfig.VITE_ENVIRONMENT,
  branch: "main",
});

if (envConfig.VITE_API_HOST) {
  Stack.setHost(envConfig.VITE_API_HOST);
}

async function run() {
  try {
    const query = Stack.ContentType('header_v2').Entry('bltdf9b155a6ba1861b');
    const result = await query.toJSON().fetch();
    fs.writeFileSync('header-v2-response.json', JSON.stringify(result, null, 4));
    console.log('Successfully wrote to header-v2-response.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
