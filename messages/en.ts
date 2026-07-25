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

  // Auth — errors
  "error-backend-unavailable": "Server error",
  "error-authentication-failed": "Authentication failed. Please try again.",
  "error-fetch-users-failed": "Failed to load users. Please try again.",
  "error-fetch-user-failed": "Failed to load user. Please try again.",

  // Users & Friends
  "label-users-title": "Users",
  "label-users-description": "People on BuzzTown",
  "label-users-loading": "Loading users...",
  "label-users-empty": "No users found.",
  "label-add-friend": "Add Friends",
  "placeholder-find-friends": "Find friends by name or email...",
  "label-searching-users": "Searching users...",
  "label-start-chat": "Message",
  "label-search-friends-prompt": "Search for Friends",
  "label-search-friends-hint": "Type a name or email address above to search for people on BuzzTown.",
  "label-no-search-results": "No users found matching your search.",

  // General — pages & errors
  "label-not-found": "Not Found",
  "label-not-found-description": "Could not find requested resource.",
  "label-return-home": "Return Home",
  "something-went-wrong": "Something went wrong!",
  "try-again": "Try again",

  // General — UI
  "label-toggle-theme": "Toggle theme",
  "label-word-placeholder": "Word",

  // Settings
  "label-settings": "Settings",
  "label-profile": "Profile",
  "label-manage-friends": "Manage Friends",
  "label-blocked-users": "Blocked Users",
  "label-remove": "Remove",
  "label-block": "Block",
  "label-unblock": "Unblock",
  "label-restore": "Restore",
  "label-no-friends": "No friends found.",
  "label-no-blocked": "No blocked users.",
  "label-profile-details": "Profile Details",
  "label-name": "Name",
  "label-close": "Close",
  "label-loading-profile": "Loading profile...",
  "label-loading-friends": "Loading friends...",
} as const;

export default messages;
