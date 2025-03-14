export interface OrganizationSubscription {
  id: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  plan: "FREE" | "PROFESSIONAL" | "ENTERPRISE";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING" | "PAUSED";
  currentPeriodStart: Date;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialStart: Date | null;
  trialEnd: Date | null;
  amount: number;
}

export interface PolarSubscription {
  createdAt: string;
  modifiedAt: string;
  id: string;
  amount: number;
  currency: string;
  recurringInterval: "month";
  status: "incomplete";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string;
  startedAt: string;
  endsAt: string;
  endedAt: string;
  customerId: string;
  productId: string;
  priceId: string;
  discountId: string;
  checkoutId: string;
  customerCancellationReason: "customer_service";
  customerCancellationComment: string;
  metadata: Record<string, unknown>;
  customFieldData: Record<string, unknown>;
  customer: {
    id: string;
    createdAt: string;
    modifiedAt: string;
    metadata: Record<string, unknown>;
    externalId: string;
    email: string;
    emailVerified: boolean;
    name: string;
    billingAddress: {
      line1: string;
      line2: string;
      postalCode: string;
      city: string;
      state: string;
      country: string;
    };
    taxId: string[];
    organizationId: string;
    avatarUrl: string;
  };
  userId: string;
  user: {
    id: string;
    email: string;
    publicName: string;
    avatarUrl: string;
    githubUsername: string;
  };
  product: {
    createdAt: string;
    modifiedAt: string;
    id: string;
    name: string;
    description: string;
    recurringInterval: "month";
    isRecurring: boolean;
    isArchived: boolean;
    organizationId: string;
    metadata: Record<string, unknown>;
    prices: {
      createdAt: string;
      modifiedAt: string;
      id: string;
      amountType: string;
      isArchived: boolean;
      productId: string;
      type: string;
      recurringInterval: "month";
      priceCurrency: string;
      priceAmount: number;
      legacy: boolean;
    }[];
    benefits: {
      createdAt: string;
      modifiedAt: string;
      id: string;
      type: string;
      description: string;
      selectable: boolean;
      deletable: boolean;
      organizationId: string;
      properties: {
        note: string;
      };
      isTaxApplicable: boolean;
    }[];
    medias: {
      id: string;
      organizationId: string;
      name: string;
      path: string;
      mimeType: string;
      size: number;
      storageVersion: string;
      checksumEtag: string;
      checksumSha256Base64: string;
      checksumSha256Hex: string;
      lastModifiedAt: string;
      version: string;
      service: string;
      isUploaded: boolean;
      createdAt: string;
      sizeReadable: string;
      publicUrl: string;
    }[];
    attachedCustomFields: {
      customFieldId: string;
      customField: {
        createdAt: string;
        modifiedAt: string;
        id: string;
        metadata: Record<string, unknown>;
        type: string;
        slug: string;
        name: string;
        organizationId: string;
        properties: {
          formLabel: string;
          formHelpText: string;
          formPlaceholder: string;
          textarea: boolean;
          minLength: number;
          maxLength: number;
        };
      };
      order: number;
      required: boolean;
    }[];
  };
  price: {
    createdAt: string;
    modifiedAt: string;
    id: string;
    amountType: string;
    isArchived: boolean;
    productId: string;
    type: string;
    recurringInterval: "month";
    priceCurrency: string;
    priceAmount: number;
    legacy: boolean;
  };
  discount: {
    duration: "once";
    type: "fixed";
    amount: number;
    currency: string;
    createdAt: string;
    modifiedAt: string;
    id: string;
    metadata: Record<string, unknown>;
    name: string;
    code: string;
    startsAt: string;
    endsAt: string;
    maxRedemptions: number;
    redemptionsCount: number;
    organizationId: string;
  };
}
