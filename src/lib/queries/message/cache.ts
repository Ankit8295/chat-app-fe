import { InfiniteData } from "@tanstack/react-query";
import { Message, MessagePageResponse } from "./types";

export function flattenMessagePages(
  data: InfiniteData<MessagePageResponse> | undefined,
): Message[] {
  if (!data) return [];

  const seen = new Set<string>();
  const messages: Message[] = [];

  for (const page of data.pages) {
    for (const message of page.items) {
      if (seen.has(message.id)) continue;
      seen.add(message.id);
      messages.push(message);
    }
  }

  return messages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function upsertMessageInCache(
  data: InfiniteData<MessagePageResponse> | undefined,
  message: Message,
): InfiniteData<MessagePageResponse> {
  if (!data || data.pages.length === 0) {
    return {
      pages: [
        {
          items: [message],
          prevCursor: null,
          nextCursor: null,
        },
      ],
      pageParams: [undefined],
    };
  }

  const alreadyExists = data.pages.some((page) =>
    page.items.some((item) => item.id === message.id),
  );
  if (alreadyExists) {
    return data;
  }

  const [firstPage, ...restPages] = data.pages;
  return {
    ...data,
    pages: [
      {
        ...firstPage,
        items: [message, ...firstPage.items],
      },
      ...restPages,
    ],
  };
}
