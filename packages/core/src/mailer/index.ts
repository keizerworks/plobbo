import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { Resource } from "sst/resource";

const client = new SESv2Client();

interface Props {
  to: { addr: string };
  subject: string;
  message: {
    data: string;
    type: "html" | "string";
  };
}

export const sendMail = async (props: Props) => {
  await client.send(
    new SendEmailCommand({
      FromEmailAddress: "auth@" + Resource.email.sender,
      Destination: { ToAddresses: [props.to.addr] },
      Content: {
        Simple: {
          Subject: { Data: props.subject },
          Body: {
            Html:
              props.message.type === "html"
                ? { Data: props.message.data, Charset: "UTF-8" }
                : undefined,
            Text:
              props.message.type === "string"
                ? { Data: props.message.data }
                : undefined,
          },
        },
      },
    }),
  );
};
