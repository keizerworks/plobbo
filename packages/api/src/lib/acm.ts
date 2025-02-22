import {
  ACMClient,
  DeleteCertificateCommand,
  DescribeCertificateCommand,
} from "@aws-sdk/client-acm";

export const acm = new ACMClient({ region: "us-east-1" });

export const getACMValidationOption = async (CertificateArn: string) => {
  const certDetails = await acm.send(
    new DescribeCertificateCommand({ CertificateArn }),
  );

  if (!certDetails.Certificate?.DomainValidationOptions) {
    return;
  }

  return certDetails.Certificate.DomainValidationOptions[0];
};

export const removeACMValidation = async (CertificateArn: string) => {
  await acm.send(new DeleteCertificateCommand({ CertificateArn }));
};
