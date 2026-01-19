export default {
  home: {
    welcome: "Welcome to vkychatapp",
    signUp: "Sign up",
    signIn: "Sign in",
    home: "Home",
    infoMessage: `
      ⚠️ This application is <strong>not for commercial purposes</strong>.<br>
      Please do not share <strong>personal information</strong> (phone number, address, password, etc.).<br><br>
      🔒 The app supports <strong>end-to-end encryption (E2EE)</strong>.<br>
      💬 Provides <strong>real-time 1v1 chat</strong>.<br>
      🛡️ Includes <strong>privacy settings</strong>.<br><br>
      📧 Within the application, you can contact me via 
      <a href="mailto:veyselkaraniyazici@gmail.com">veyselkaraniyazici@gmail.com</a>.
    `,
  },
  login: {
    password: "Password",
    emailError: "Please enter a valid email address",
    incorrectEmailOrPassword: "Incorrect email address or password",
    invalidOperation: "Invalid operation",
    passwordError: "Please enter a valid password",
    passwordEmptyError: "Password cannot be empty",
    passwordLength: "Password must be 8-32 characters long.",
    success: "Login successful",
    errorCode1000: "Incorrect email address or password",
    errorCode1003: "Email needs verification. Please check your inbox",
  },
  register: {
    registerSuccess:
      "Sign up successful. Please check your email to activate your account.",
    errorCode1002: "Email address already registered",
  },
  forgotPassword: {
    forgotPassword: "Forgot password",
    emailMessage: "Please enter your email address for the verification code.",
    sendMail: "Send mail",
    verificationCode: (email) =>
      `Enter the verification code sent to ${email}.`,
    resendCode: "Resend code",
    verifyCode: "Verify code",
    newPassword: "New password",
    resetPasswordMessage: (email) => `Set a new password for ${email}.`,
    confirmPassword: "Confirm password",
    changePassword: "Change password",
    verificationCodeError: "Verification code cannot be empty",
    passwordsNotMatch: "Passwords do not match.",
    successMessage:
      "Password updated successfully. Redirecting to the login page in 5 seconds.",
    failedMessage: "Password reset failed",
    failedMessageCatch: "Password reset failed. Try again later",
    timerError: "5 minutes have passed. Redirecting to the homepage...",
    errorCode1004: "Email address not found",
    verificationCodeErrorMessage: (remainingAttempts) =>
      `Invalid OTP Code. Remaining attempts: ${remainingAttempts}`,
    errorCode1011: "Too many attempts",
    errorCode1012: "Password reset failed, please try again",
    errorCode1013: "Email mismatch",
    errorCode1014: "Invalid reset token",
    errorCode1015: "Otp not verified",
  },
  selectMessageBoxMessage: {
    selectMessageBoxMessage: "Select a friend to start chatting",
  },
  pwdRules: {
    length: "8‑32 character",
    upperCase: "Minimum 1 uppercase letter (A‑Z)",
    lowerCase: "Minimum 1 lowercase letter (a-z)",
    number: "Minimum 1 number (0‑9)",
    specialChar: "At least 1 special character (@ # $ % ^ & + = . ? ! - _)",
  },
  addContacts: {
    contactNameMinLength: "Minimum 2 characters allowed",
    contactNameMaxLength: "Maximum 32 characters allowed",
    name: "Name",
    addContact: "Add contact",
  },
  updateUser: {
    valueEmpty: "Value is required and cannot be empty.",
  },
  chatBox: {
    chatBlock: (email) => `Do you want to block the user ${email}?`,
    chatUnblock: (email) => `Do you want to unblock the user${email}?`,
    toastrUnblock: (email) => `${email} has been unblocked.`,
    toastrBlock: (email) => `${email} has been blocked.`,
    block: "Block",
    unBlock: "Unblock",
    toastrBlockError: (email) =>
      `An error occurred. The user ${email} could not be blocked.`,
    toasterUnblockError: (email) =>
      `An error occurred. The block on user ${email} could not be removed.`,
    deleteMessage: (email) => `Do you want to delete the chat with ${email}?`,
    deleteSuccess: "Chat deleted successfully.",
    deleteFailed: "Failed to delete chat. Please try again.",
    deleteChat: "Delete chat",
    unreadMessageCountAriaLabel: (unreadMessageCount) =>
      `${unreadMessageCount} unread message`,
  },
  inviteUser: {
    invite: "Invite",
    invited: "Invited",
    alreadyBeenInvited: (contactName) =>
      `${contactName} has already been invited.`,
    inviteMessage: (contactName) =>
      `Do you want to invite the user ${contactName}?`,
  },
  search: {
    searchPlaceHolder: "Search by name or email",
  },
  contacts: {
    deleteUser: "Delete user",
    deleteUserModalMessage: (contactName) =>
      `Do you want to delete the user ${contactName}?`,
    errorCode3001: "Contact already exists",
    contactAddedSuccessfully: "Contact added successfully",
  },
  modal: {
    yes: "Yes",
    no: "No",
    continue: "Continue",
    ok: "Ok",
    upload: "Upload",
    cancel: "Cancel",
  },
  messageBox: {
    typing: "typing...",
    messageBoxPlaceHolder: "Write a message",
    blockInputMessage: (userName) =>
      `You cannot send a message to blocked user ${userName}.`,
    decryptedErrorMessage: "Failed to decrypt the message.",
    online: "online",
    sendMessageContentLengthError: (messageLength, currentMessageLength) =>
      `You are trying to send a message with ${currentMessageLength} characters. You can send a maximum of ${messageLength} characters.`,
    sendMessageIsBlockedMessage:
      "This user is blocked. You cannot send a message.",
    sendMessageIsBlockedMeMessage:
      "This user has blocked you. You cannot send a message.",
    lastSeen: "last seen",
  },
  updateUserProfile: {
    about: "About",
    nameError: "Name cannot be empty",
    aboutError: "About cannot be empty",
    viewProfilePhoto: "View photo",
    removeProfilePhoto: "Remove photo",
    uploadProfilePhoto: "Upload photo",
    warningMessage:
      "The selected image is too small. Please choose an image with minimum dimensions of 192x192 pixels.",
    nameUpdated: "Name updated successfully",
    aboutUpdated: "About updated successfully",
  },
  chat: {
    loadingMessage: "Loading chats...",
    loadingErrorMessage: "An error occurred. Please try again later.",
    senderBlocked: "You are blocked and cannot send messages to this user",
    recipientBlocked: "Recipient has blocked you from sending messages",
    read: " Read ",
    delivered: " Delivered ",
  },
  verificationFailed: {
    successMessage:
      "Verification email has been resent. Please check your inbox.",
    failedMessage: "Failed to resend verification email. Please try again.",
    errorMessage: "An error occurred, please try again.",
    sending: "Sending...",
    expiredLink: "The verification link is invalid or expired.",
    verificationFailedMessage: "Verification failed",
    resendVerificationMessage: "Resend verification email",
    backToHome: "← Back to Home",
  },
  verificationSuccess: {
    successMessage:
      "Your account has been successfully verified. You can now log in to your account.",
    goToLogin: "Go to Login",
  },
  verify: {
    verifyMessage: "Verifying your account, please wait...",
  },
  settings: {
    settings: "Settings",
    account: "Account",
    privacy: "Privacy",
    changePassword: "Change password",
    logout: "Logout",
    personalInformation: "Who can see my personal information",
    lastSeenAndOnline: "Last seen and online",
    profilePhoto: "Profile photo",
    about: "About",
    blockedUsers: "Blocked users",
    readReceipt: "Read receipt",
    readSettingsInfo:
      "If you disable this feature, you won’t be able to send or receive read receipts.",
    whoCanSeeMyLastSeen: "Who can see my last seen",
    everyone: "Everyone",
    myContacts: "My contacts",
    nobody: "Nobody",
    whoCanSeeOnlineInfo: "Who can see when I’m online?",
    sameAsLastSeen: "Same as last seen",
    lastSeenAndOnlineInfo:
      " if you don’t share your information, you won’t be able to see other users’ last seen and online status either.",
    and: " and ",
    lastSeen: "Last seen",
    online: "online",
    whoCanSeeMyProfilePhoto: "Who can see my profile photo",
    whoCanSeeMyAbout: "Who can see my About",
    oldPassword: "Old password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    fillAllFields: "Please fill in all fields",
    passwordsNotMatch: "Passwords do not match",
    passwordChangeSuccess: "Password changed successfully",
    passwordChangeFail: "Failed to change password",
    oldPasswordRequired: "Old password cannot be empty",
    oldPasswordInvalid: "Old password format is invalid",
    newPasswordRequired: "New password cannot be empty",
    newPasswordInvalid: "New password format is invalid",
  },
  contactInformation: {
    contactInformation: "Contact info",
    block: " block",
    unBlock: " unblock",
  },
  errors: {
    status400: "Bad request. Please check your input.",
    status401: "Unauthorized. Please log in again.",
    status403: "You do not have permission to perform this action.",
    status404: "The requested resource was not found.",
    status408: "Request timed out. Please try again.",
    status429: "Too many requests. Please wait and try again.",
    status500: "Internal server error. Please try again later.",
    status502: "Invalid response from the server. Please try again later.",
    status503: "Service temporarily unavailable. Please try again later.",
    status504: "Server took too long to respond. Please try again later.",
    status3008: "You can’t add yourself as a contact.",
    unexpectedError: "An unexpected error occurred. Please try again later.",
  },
  lastSeen: {
    today: "Today",
    yesterday: "Yesterday",
  },
};
