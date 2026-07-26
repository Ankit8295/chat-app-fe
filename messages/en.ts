const messages = {
  // App info
  "app-name": "BuzzTown",
  "app-description": "A location-based social media interaction app.",

  // Auth — login & register
  "label-login-form-title": "Log in to BuzzTown",
  "label-login-form-description":
    "Welcome back! Please sign in to your account",
  "label-register-title": "Register",
  "label-register-description": "Create your account",
  "label-login": "Log In",
  "label-signup": "Sign up",
  "label-email": "Email",
  "label-email-placeholder": "Enter your email",
  "label-display-name": "Display Name",
  "label-display-name-placeholder": "Enter your display name",
  "label-password": "Password",
  "label-password-placeholder": "Enter your password",
  "label-create-password-placeholder": "Create your password",
  "label-password-must": "Password must:",

  // Auth — validation
  "validation-name-min": "Name must be at least 2 characters long.",
  "validation-email-invalid": "Please enter a valid email.",
  "validation-password-min-length": "Be at least 8 characters long",
  "validation-password-letter": "Contain at least one letter.",
  "validation-password-number": "Contain at least one number.",
  "validation-password-special": "Contain at least one special character.",

  // Auth & API — errors
  "error-backend-unavailable": "Server error",
  "error-authentication-failed": "Authentication failed. Please try again.",
  "error-fetch-users-failed": "Failed to load users. Please try again.",
  "error-fetch-user-failed": "Failed to load user. Please try again.",
  "error-fetch-friends-failed":
    "Failed to load friends list. Please try again.",

  // Users, Friends & Conversations
  "label-add-friend": "Add Friends",
  "description-add-friend-modal": "Find friends and start new conversations.",
  "placeholder-find-friends": "Find friends by name or email...",
  "label-searching-users": "Searching users...",
  "label-start-chat": "Message",
  "label-search-friends-prompt": "Search for Friends",
  "label-search-friends-hint":
    "Type a name or email address above to search for people on BuzzTown.",
  "label-no-search-results": "No users found matching your search.",
  "label-no-search-results-hint":
    "Try searching with a different name or email address.",
  "label-results": "Results",
  "label-page-loaded": "Page {page} loaded",
  "label-loading-more-users": "Loading more users...",
  "label-loading-more-friends": "Loading more friends...",
  "label-scroll-for-more": "Scroll down for more...",
  "label-end-of-results": "Reached end of results",
  "label-end-of-friends": "Reached end of friends list",
  "label-conversation": "Conversation",
  "label-online": "Online",
  "label-no-conversation-selected": "Select a conversation",
  "description-no-conversation-selected":
    "Choose a conversation from the sidebar or add a friend to start chatting.",

  // General — pages & errors
  "label-not-found": "Not Found",
  "label-not-found-description": "Could not find requested resource.",
  "label-return-home": "Return Home",
  "something-went-wrong": "Something went wrong!",
  "try-again": "Try again",

  // General — UI
  "label-toggle-theme": "Toggle theme",
  "label-word-placeholder": "Word",
  "label-open-menu": "Open menu",
  "label-toggle-sidebar": "Toggle sidebar",
  "label-expand-sidebar": "Expand sidebar",
  "label-collapse-sidebar": "Collapse sidebar",

  // Settings
  "label-settings": "Settings",
  "description-settings-modal":
    "Customize your profile settings and manage friends.",
  "label-profile": "Profile",
  "label-manage-friends": "Manage Friends",
  "label-remove": "Remove",
  "label-block": "Block",
  "label-no-friends": "No friends found.",
  "label-profile-details": "Profile Details",
  "label-name": "Name",
  "label-close": "Close",
  "label-loading-profile": "Loading profile...",
  "label-loading-friends": "Loading friends...",
} as const;

export default messages;
