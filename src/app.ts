import Fastify from "fastify"
import axios from 'axios'

const server = Fastify()

async function redirectTrafficToCloudflare() {
  try {
    // Configuration de l'appel à l'API Cloudflare pour modifier l'enregistrement DNS
    const apiUrl = 'https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records/{RECORD_ID}';
    const apiKey = 'YOUR_API_KEY';
    const zoneId = 'YOUR_ZONE_ID';
    const recordId = 'YOUR_RECORD_ID';

    // Corps de la requête pour modifier l'enregistrement DNS (par exemple, changer l'adresse IP)
    const requestBody = {
      type: 'A', // Type d'enregistrement DNS (par exemple, A, CNAME, etc.)
      name: 'example.com', // Nom de l'enregistrement DNS
      content: 'NEW_IP_ADDRESS', // Nouvelle adresse IP vers laquelle rediriger le trafic
    };

    // Envoi de la requête à l'API Cloudflare
    const response = await axios.put(apiUrl, requestBody, {
      headers: {
        'X-Auth-Key': apiKey,
        'X-Auth-Email': 'YOUR_EMAIL_ADDRESS',
      },
    });

    console.log('Cloudflare API response:', response.data);
  } catch (error) {
    redirectTrafficToCloudflare()
    console.error('Error redirecting traffic to Cloudflare:', error);
  }
}

server.get('/healthcheck', async function () {
  return { status: "OK" }
})

server.get('/check-other-server', async (request, reply) => {
  try {
    // const response = await axios.get('192.168.1.200');
    // await axios.get('192.168.1.211');
    // await axios.get('192.168.1.210');
    const response = await axios.get('https://www.google.com');
    console.log('response', response);

    // Si la requête réussit, le serveur distant est actif
    reply.send({ status: 'Server is awake' });
  } catch (error) {
    // Si la requête échoue, le serveur distant est inaccessible
    reply.status(500).send({ status: 'Server is not responding' });
  }
});

async function main() {
  try {
    await server.listen(3000, '0.0.0.0')
    console.log('Server ready at http://localhost:3000')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()

