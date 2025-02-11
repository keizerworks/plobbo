import type { SQSHandler } from "aws-lambda";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { Resource } from "sst/resource";

const sesClient = new SESv2Client();

interface SendEmailQueue {
  to: string;
  subject: string;
  body: string;
  type: "text" | "html";
}

export default {
  sendMail: async function (event) {
    for (const record of event.Records) {
      const input = JSON.parse(record.body) as SendEmailQueue;

      try {
        const command = new SendEmailCommand({
          Destination: { ToAddresses: [input.to] },
          Content: {
            Simple: {
              Body: {
                Text: input.type === "text" ? { Data: input.body } : undefined,
                Html: input.type === "html" ? { Data: input.body } : undefined,
              },
              Subject: { Data: input.subject },
            },
          },
          FromEmailAddress: `Invoicen <no-reply@${Resource.email.sender}>`,
        });
        await sesClient.send(command);
      } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
      }
    }
  } satisfies SQSHandler,
};
