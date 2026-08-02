import { useInfiniteQuery } from "@tanstack/react-query";
import { MessagesQueryKeys } from "../query-keys";
import { getMessages } from "./api";
import { flattenMessagePages } from "./cache";

const DEFAULT_MESSAGE_PAGE_SIZE = 50;

function useInfiniteMessages(conversationId: string, limit = DEFAULT_MESSAGE_PAGE_SIZE) {
  const query = useInfiniteQuery({
    queryKey: [MessagesQueryKeys.MESSAGES, conversationId],
    queryFn: ({ pageParam }) =>
      getMessages(conversationId, {
        nextCursor: pageParam,
        limit,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!conversationId,
  });

  const messages = flattenMessagePages(query.data);

  return {
    ...query,
    messages,
  };
}

export { useInfiniteMessages };
