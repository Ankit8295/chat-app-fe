import { useInfiniteQuery } from "@tanstack/react-query";
import { MessagesQueryKeys } from "../query-keys";
import { getMessages } from "./api";
import { flattenMessagePages } from "./cache";
import { decryptWireMessage } from "@/lib/crypto/message";
import { ensureConversationKey } from "@/lib/crypto/conversation";
import { useCrypto } from "@/lib/crypto/crypto-provider";

const DEFAULT_MESSAGE_PAGE_SIZE = 50;

function useInfiniteMessages(
  conversationId: string,
  participantIds: string[] = [],
  limit = DEFAULT_MESSAGE_PAGE_SIZE,
) {
  const { ready } = useCrypto();
  const query = useInfiniteQuery({
    queryKey: [MessagesQueryKeys.MESSAGES, conversationId],
    queryFn: async ({ pageParam }) => {
      await ensureConversationKey(conversationId, participantIds);
      const page = await getMessages(conversationId, {
        nextCursor: pageParam,
        limit,
      });
      const items = await Promise.all(page.items.map(decryptWireMessage));
      return { ...page, items };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!conversationId && ready && participantIds.length > 0,
  });

  const messages = flattenMessagePages(query.data);

  return {
    ...query,
    messages,
  };
}

export { useInfiniteMessages };
