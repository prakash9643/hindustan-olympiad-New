import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

const apiKey: string = process.env.BREVO_API_KEY || "";

if (!apiKey) {
  throw new Error("❌ BREVO_API_KEY is not defined in environment variables");
}

const brevoClient = new TransactionalEmailsApi();
brevoClient.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

export default brevoClient;
