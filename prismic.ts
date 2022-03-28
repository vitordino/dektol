import * as prismic from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "./sm.json";

export const endpoint = sm.apiEndpoint;
export const repositoryName = prismic.getRepositoryName(endpoint);

// Update the Link Resolver to match your project's route structure
export const linkResolver: LinkResolverFunction = (doc) => {
  switch (doc.type) {
    case "homepage":
      return "/";
    case "page":
    default:
      return `/${doc.uid || ""}`;
  }
};

// This factory function allows smooth preview setup

type CreateClientConfig = prismic.ClientConfig & {
  previewData?: Record<string, unknown>;
  req?: prismic.HttpRequestLike;
};

export function createClient(config: CreateClientConfig = {}) {
  const client = prismic.createClient(endpoint, config);

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
}
