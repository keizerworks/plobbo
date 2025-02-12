import { AwsClient } from "aws4fetch";
import { createMimeMessage } from "mimetext/browser";
import { Resource } from "sst/resource";

import { utf8ToBase64 } from "../lib/utils";

interface Props {
  accessKeyId: string;
  secretAccessKey: string;

  to: { name?: string; addr: string };
  subject: string;
  message: {
    data: string;
    type: "html" | "string";
  };
}

export const sendMail = async (props: Props) => {
  const new_email = createMimeMessage();

  new_email.setSubject(props.subject);
  new_email.setTo(props.to);
  new_email.setSender({
    name: "plobbo",
    addr: "no-reply@" + Resource.email.sender,
  });

  new_email.addMessage({
    data: props.message.data,
    contentType: props.message.type === "html" ? "text/html" : "text/plain",
    charset: '"utf-8"',
  });

  const body = {
    Content: { Raw: { Data: utf8ToBase64(new_email.asRaw()) } },
  };

  const aws_client = new AwsClient({
    accessKeyId: props.accessKeyId,
    secretAccessKey: props.secretAccessKey,
    service: "ses",
    retries: 0,
  });

  return aws_client
    .fetch("https://email.us-east-1.amazonaws.com/v2/email/outbound-emails", {
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
    .then(async (res) => {
      if (!res.ok) {
        console.error(`SES response not ok: ${res.status}`);
        if (res.body) console.error(`SES response body: ${await res.text()}`);
        throw new Error(`SES response not ok: ${res.status}`);
      } else {
        console.debug(`SES response ok: ${res.status}`);
        const res_json = await res.json();
        console.debug(`SES response body: ${JSON.stringify(res_json)}`);
      }
    });
};
