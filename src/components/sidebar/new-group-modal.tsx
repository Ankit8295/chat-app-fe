"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useInfiniteSearchUsers } from "@/lib/queries/user/query";
import { useCreateConversation } from "@/lib/queries/chat/query";
import type { UserSearchResult } from "@/lib/queries/user/types";
import {
  createGroupFormSchema,
  type CreateGroupFormValues,
} from "@/lib/queries/user/validations";
import { useLayoutStore } from "@/store/store";
import ActionIcon from "@/components/ui/action-icon";
import Avatar from "@/components/ui/avatar/avatar";
import Button from "@/components/ui/buttons/button";
import CustomInput from "@/components/ui/inputs/input";
import InfoBox from "@/components/ui/info-box";
import SlidePanel from "@/components/ui/slide-panel";
import Typography from "@/components/ui/typography/typography";
import { UserListItem } from "@/components/ui/user-list-item";
import CheckIcon from "@/icons/check";
import SearchIcon from "@/icons/search";
import { cn } from "../../../cn.config";
import { ROUTES } from "../../../routes.config";

const NAME_MAX = 50;
const ABOUT_MAX = 200;

export default function NewGroupModal() {
  const t = useTranslations();
  const router = useRouter();
  const isNewGroupOpen = useLayoutStore((state) => state.isNewGroupOpen);
  const setNewGroupOpen = useLayoutStore((state) => state.setNewGroupOpen);
  const setActiveConversationId = useLayoutStore(
    (state) => state.setActiveConversationId,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserSearchResult[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateGroupFormValues, string>>
  >({});

  const createConversation = useCreateConversation();

  const trimmedQuery = searchQuery.trim();
  const schema = useMemo(() => createGroupFormSchema(t), [t]);
  const selectedIds = useMemo(
    () => selectedUsers.map((user) => user.id),
    [selectedUsers],
  );

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchUsers(trimmedQuery);

  const allUsers = data?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    if (isNewGroupOpen) return;

    setName("");
    setAbout("");
    setSearchQuery("");
    setSelectedUsers([]);
    setErrors({});
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [isNewGroupOpen]);

  useEffect(() => {
    if (!isNewGroupOpen || !trimmedQuery || !hasNextPage || isFetchingNextPage)
      return;

    const scrollContainer = scrollContainerRef.current;
    const sentinel = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollContainer, threshold: 0.1 },
    );

    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [
    isNewGroupOpen,
    trimmedQuery,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data?.pages.length,
  ]);

  const toggleParticipant = (user: UserSearchResult) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((item) => item.id === user.id);
      return exists
        ? prev.filter((item) => item.id !== user.id)
        : [...prev, user];
    });
    setErrors((prev) => ({ ...prev, participantIds: undefined }));
  };

  const removeParticipant = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
    setErrors((prev) => ({ ...prev, participantIds: undefined }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const parsed = schema.safeParse({
      name,
      about,
      participantIds: selectedIds,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CreateGroupFormValues, string>> =
        {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          (key === "name" || key === "about" || key === "participantIds") &&
          !fieldErrors[key]
        ) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    createConversation.mutate(
      {
        type: "GROUP",
        name: parsed.data.name,
        about: parsed.data.about || undefined,
        participants: parsed.data.participantIds,
      },
      {
        onSuccess: (conversation) => {
          setNewGroupOpen(false);
          setActiveConversationId(conversation.id);
          router.push(ROUTES.CONVERSATION(conversation.id));
        },
      },
    );
  };

  return (
    <SlidePanel
      open={isNewGroupOpen}
      onClose={() => setNewGroupOpen(false)}
      title={t("label-new-group")}
    >
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="relative">
              <Avatar
                name={name || t("label-new-group")}
                src={imagePreview ?? undefined}
                size="xl"
                shape="circle"
                className="size-24 text-2xl border-2 border-border"
              />
              <div className="absolute -right-1 -bottom-1">
                <ActionIcon
                  name="pencil"
                  variant="solid"
                  label={t("aria-change-group-image")}
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <CustomInput
              label={t("label-group-name")}
              variant="underlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder={t("placeholder-group-name")}
              maxLength={NAME_MAX}
              error={errors.name}
              rightContent={
                <Typography variant="span" className="text-xs text-muted">
                  {NAME_MAX - name.length}
                </Typography>
              }
            />

            <CustomInput
              label={t("label-group-about")}
              variant="underlined"
              value={about}
              onChange={(e) => {
                setAbout(e.target.value);
                setErrors((prev) => ({ ...prev, about: undefined }));
              }}
              placeholder={t("placeholder-group-about")}
              maxLength={ABOUT_MAX}
              error={errors.about}
              rightContent={
                <Typography variant="span" className="text-xs text-muted">
                  {ABOUT_MAX - about.length}
                </Typography>
              }
            />
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <Typography
              variant="span"
              className="text-xs font-bold uppercase tracking-wider text-muted"
            >
              {t("label-add-participants")}
            </Typography>
            <Typography variant="span" className="text-xs text-muted">
              {t("label-participants-selected", {
                count: selectedUsers.length,
              })}
            </Typography>
          </div>

          {errors.participantIds && (
            <Typography
              variant="span"
              className="mb-2 block text-xs text-destructive"
            >
              {errors.participantIds}
            </Typography>
          )}

          {selectedUsers.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 py-1 pl-1 pr-1.5"
                >
                  <Avatar
                    name={user.name}
                    src={user.img}
                    size="sm"
                    shape="rounded"
                  />
                  <Typography
                    variant="span"
                    className="max-w-24 truncate text-xs text-foreground"
                  >
                    {user.name}
                  </Typography>
                  <ActionIcon
                    name="x"
                    label={t("aria-remove-participant", { name: user.name })}
                    className="size-6 rounded-md"
                    iconClassName="size-3.5"
                    onClick={() => removeParticipant(user.id)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="relative mb-3">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("placeholder-find-people")}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {!trimmedQuery ? (
            <InfoBox
              icon={<SearchIcon className="size-8 stroke-current" />}
              iconContainerClassName="size-14 bg-secondary text-primary/80"
              title={t("label-search-participants-prompt")}
              titleClassName="text-sm font-semibold"
              description={t("label-search-participants-hint")}
              descriptionClassName="text-xs max-w-xs leading-relaxed"
              className="p-6 gap-2"
            />
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <Typography variant="span" className="text-muted text-sm">
                {t("label-searching-users")}
              </Typography>
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <Typography variant="span" className="text-muted text-sm">
                {t("error-fetch-users-failed")}
              </Typography>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border">
              <InfoBox
                title={t("label-no-search-results")}
                titleClassName="text-sm font-semibold"
                description={t("label-no-search-results-hint")}
                descriptionClassName="text-xs"
                className="p-6 gap-2"
              />
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1"
            >
              {allUsers.map((user) => {
                const selected = selectedIds.includes(user.id);
                return (
                  <UserListItem
                    key={user.id}
                    name={user.name}
                    email={user.email}
                    image={user.img}
                    selected={selected}
                    onClick={() => toggleParticipant(user)}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-md border transition-colors",
                        selected
                          ? "border-primary bg-primary text-background"
                          : "border-border text-transparent",
                      )}
                    >
                      <CheckIcon className="size-3.5" />
                    </span>
                  </UserListItem>
                );
              })}

              <div
                ref={loadMoreRef}
                className="py-2 flex items-center justify-center shrink-0"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <Typography variant="span">
                      {t("label-loading-more-users")}
                    </Typography>
                  </div>
                ) : hasNextPage ? (
                  <Typography variant="span" className="text-xs text-muted/60">
                    {t("label-scroll-for-more")}
                  </Typography>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border p-2.5">
          <Button
            type="submit"
            fullWidth
            disabled={createConversation.isPending}
          >
            {t("label-create-group")}
          </Button>
        </div>
      </form>
    </SlidePanel>
  );
}
