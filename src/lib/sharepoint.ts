import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

let graphClient: Client | null = null;

export async function getGraphClient() {
  if (graphClient) return graphClient;

  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  const tenantId = process.env.AZURE_TENANT_ID;

  if (!clientId || !clientSecret || !tenantId) {
    console.warn("⚠️ Missing Azure AD credentials in .env. SharePoint upload will be bypassed.");
    return null;
  }

  const msalConfig = {
    auth: {
      clientId,
      clientSecret,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    }
  };

  const cca = new ConfidentialClientApplication(msalConfig);

  const authProvider = async (callback: any) => {
    try {
      const response = await cca.acquireTokenByClientCredential({
        scopes: ['https://graph.microsoft.com/.default'],
      });
      callback(null, response?.accessToken);
    } catch (error) {
      console.error("Authentication to Microsoft Graph failed:", error);
      callback(error, null);
    }
  };

  graphClient = Client.init({ authProvider });
  return graphClient;
}
