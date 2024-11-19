import "@angular/localize/init";

// URLs (should be ignored)
const validUrls = {
  website: "https://example.com",
  localUrl: "http://localhost:3000",
  apiEndpoint: "https://api.example.com/v1/users",
};

// CSS selectors (should be ignored)
const cssSelectors = {
  className: ".header-main",
  idSelector: "#main-content",
  complexSelector: ".nav-item.active",
};

// Empty and special characters (should be ignored)
const specialCases = {
  empty: "",
  numbers: "123456",
  specialChars: "!@#$%^&*()",
  whitespace: "   ",
};

// Strings that should be localized
class UserInterface {
  private welcomeMessage = "Welcome to our application!";
  private errorMessage = "An error occurred while processing your request.";

  public getGreeting(name: string) {
    return `Hello, ${name}!`;
  }

  public getButtonLabels() {
    return {
      submit: "Submit",
      cancel: "Cancel",
      save: "Save Changes",
    };
  }

  public getValidationMessages() {
    return {
      required: "This field is required",
      email: "Please enter a valid email address",
      password: "Password must be at least 8 characters long",
    };
  }
}

// Already localized strings (should be ignored)
class LocalizedInterface {
  private welcomeMessage = $localize`Welcome to our application!`;
  private errorMessage = $localize`An error occurred while processing your request.`;

  public getGreeting(name: string) {
    return $localize`Hello, ${name}!`;
  }

  public getButtonLabels() {
    return {
      submit: $localize`Submit`,
      cancel: $localize`Cancel`,
      save: $localize`Save Changes`,
    };
  }
}

// Mixed content for testing
export function getMixedContent() {
  return {
    // Should be ignored
    url: "https://api.example.com",
    cssClass: ".button-primary",
    empty: "",

    // Should be localized
    title: "Dashboard Overview",
    description: "View all your important metrics in one place",

    // Already localized
    footer: $localize`© 2024 All rights reserved`,

    // Template literals that should be localized
    status: `Last updated: ${new Date().toLocaleDateString()}`,
    count: `Total items: ${42}`,
  };
}

// Multiline strings
const multilineString =
  "This is a long message\
that spans multiple lines\
and should be localized";

const hello = "hello1";
const hello1 = $localize`hello1`;

const templateMultiline = `
    This is another
    multiline message
    that should be localized
    ${hello}
`;

// Error messages (should be localized)
class ErrorHandler {
  public static readonly ERRORS = {
    notFound: "Resource not found",
    unauthorized: "You are not authorized to perform this action",
    serverError: "Internal server error occurred",
  };

  public getErrorMessage(code: string) {
    return `Error ${code}: Please try again later`;
  }
}
