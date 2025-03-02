import {
  CloudFrontClient,
  GetDistributionCommand,
  UpdateDistributionCommand,
} from "@aws-sdk/client-cloudfront";
import { Resource } from "sst/resource";

const cfClient = new CloudFrontClient({ region: "us-east-1" });

const Id = Resource.CloudfrontDistributionID.value;

export async function updateDistributionWithACMCert(
  customDomain: string,
  certificateArn: string,
) {
  const getCommand = new GetDistributionCommand({ Id });
  const distributionData = await cfClient.send(getCommand);
  const etag = distributionData.ETag;
  const config = distributionData.Distribution?.DistributionConfig;

  if (!config?.Aliases?.Items) {
    throw new Error(
      "CloudFront distribution configuration is missing Aliases.Items",
    );
  }

  if (!config.Aliases.Items.includes(customDomain)) {
    config.Aliases.Items.push(customDomain);
    config.Aliases.Quantity = config.Aliases.Items.length;
  }

  // 3. Update the ViewerCertificate configuration to use your validated ACM certificate.
  config.ViewerCertificate = {
    ACMCertificateArn: certificateArn, // Your verified certificate ARN
    SSLSupportMethod: "sni-only",
    MinimumProtocolVersion: "TLSv1.2_2019",
  };

  // 4. Update the distribution with the new configuration.
  const updateCommand = new UpdateDistributionCommand({
    Id,
    IfMatch: etag,
    DistributionConfig: config,
  });

  const updateResponse = await cfClient.send(updateCommand);
  console.log("CloudFront distribution updated:", updateResponse);
}

export async function removeDistributionWithACMCert(customDomain: string) {
  const getCommand = new GetDistributionCommand({ Id });
  const distributionData = await cfClient.send(getCommand);
  const etag = distributionData.ETag;
  const config = distributionData.Distribution?.DistributionConfig;

  if (!config?.Aliases?.Items) {
    throw new Error(
      "CloudFront distribution configuration is missing Aliases.Items",
    );
  }

  const domainIndex = config.Aliases.Items.indexOf(customDomain);
  if (domainIndex !== -1) {
    config.Aliases.Items.splice(domainIndex, 1);
    config.Aliases.Quantity = config.Aliases.Items.length;
  }

  const updateCommand = new UpdateDistributionCommand({
    Id,
    IfMatch: etag,
    DistributionConfig: config,
  });

  const updateResponse = await cfClient.send(updateCommand);
  console.log("CloudFront distribution updated:", updateResponse);
}
