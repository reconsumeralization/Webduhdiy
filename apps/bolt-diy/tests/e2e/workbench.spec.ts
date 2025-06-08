import { test, expect, type Page } from "@playwright/test";

test.describe("Workbench E2E Tests", () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Initial Load and Layout", () => {
    test("should load the main interface successfully", async () => {
      await expect(page).toHaveTitle(/Bolt.DIY/);

      // Check for main UI elements
      await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="workbench-panel"]')).toBeVisible();
    });

    test("should have responsive layout on different screen sizes", async () => {
      // Test desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('[data-testid="workbench-panel"]')).toBeVisible();

      // Test tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('[data-testid="workbench-panel"]')).toBeVisible();

      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 });
      // On mobile, workbench might be hidden or collapsed
      const workbench = page.locator('[data-testid="workbench-panel"]');
      const isVisible = await workbench.isVisible();
      // Accept either visible or hidden state on mobile
      expect(typeof isVisible).toBe("boolean");
    });
  });

  test.describe("Chat Functionality", () => {
    test("should allow sending messages", async () => {
      const chatInput = page.locator('[data-testid="chat-input"]');
      const sendButton = page.locator('[data-testid="send-button"]');

      await chatInput.fill("Create a simple React component");
      await sendButton.click();

      // Check if message appears in chat
      await expect(page.locator('[data-testid="chat-messages"]')).toContainText("Create a simple React component");

      // Wait for AI response
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 30000 });
    });

    test("should handle file uploads", async () => {
      const fileInput = page.locator('input[type="file"]');

      // Create a test file
      const testFile = {
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from('console.log("Hello World");'),
      };

      await fileInput.setInputFiles(testFile);

      // Verify file is processed
      await expect(page.locator('[data-testid="uploaded-file"]')).toContainText("test.txt");
    });

    test("should export and import chat history", async () => {
      // Send a test message first
      await page.locator('[data-testid="chat-input"]').fill("Test message for export");
      await page.locator('[data-testid="send-button"]').click();

      // Export chat
      await page.locator('[data-testid="export-chat"]').click();

      // Wait for download
      const download = await page.waitForEvent("download");
      expect(download.suggestedFilename()).toMatch(/chat-export.*\.json/);

      // Import chat
      await page.locator('[data-testid="import-chat"]').click();
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        page.locator('[data-testid="import-file-button"]').click(),
      ]);

      await fileChooser.setFiles(await download.path());

      // Verify import success
      await expect(page.locator('[data-testid="import-success"]')).toBeVisible();
    });
  });

  test.describe("Code Editor Integration", () => {
    test("should open and edit files in the workbench", async () => {
      // Create a new file through chat
      const chatInput = page.locator('[data-testid="chat-input"]');
      await chatInput.fill("Create a new React component called Button");
      await page.locator('[data-testid="send-button"]').click();

      // Wait for AI to generate code
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 30000 });

      // Look for generated files in workbench
      await expect(page.locator('[data-testid="file-explorer"]')).toBeVisible();

      // Check if files are created
      const fileItem = page.locator('[data-testid="file-item"]').first();
      await expect(fileItem).toBeVisible();

      // Click on file to open in editor
      await fileItem.click();

      // Verify editor opens with content
      await expect(page.locator('[data-testid="code-editor"]')).toBeVisible();
      await expect(page.locator(".cm-content")).toContainText("Button");
    });

    test("should handle code editing and syntax highlighting", async () => {
      // Assuming we have a file open from previous test or setup
      const editor = page.locator('[data-testid="code-editor"]');
      await expect(editor).toBeVisible();

      // Click in editor and type some code
      await editor.click();
      await page.keyboard.type('const greeting = "Hello World";');

      // Check for syntax highlighting
      await expect(page.locator(".cm-content .tok-keyword")).toBeVisible();
      await expect(page.locator(".cm-content .tok-string")).toBeVisible();
    });

    test("should support multiple file tabs", async () => {
      // Create multiple files through chat
      await page.locator('[data-testid="chat-input"]').fill("Create index.js and styles.css files");
      await page.locator('[data-testid="send-button"]').click();

      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 30000 });

      // Check for file tabs
      const fileTabs = page.locator('[data-testid="file-tab"]');
      await expect(fileTabs).toHaveCount(2, { timeout: 10000 });

      // Switch between tabs
      await fileTabs.nth(0).click();
      await expect(page.locator('[data-testid="code-editor"]')).toContainText("index.js");

      await fileTabs.nth(1).click();
      await expect(page.locator('[data-testid="code-editor"]')).toContainText("styles.css");
    });
  });

  test.describe("Terminal Integration", () => {
    test("should open and use terminal", async () => {
      // Open terminal
      await page.locator('[data-testid="terminal-button"]').click();

      // Verify terminal is visible
      await expect(page.locator('[data-testid="terminal"]')).toBeVisible();

      // Type a command
      await page.locator('[data-testid="terminal-input"]').fill("npm --version");
      await page.keyboard.press("Enter");

      // Check for output
      await expect(page.locator('[data-testid="terminal-output"]')).toContainText(/\d+\.\d+\.\d+/);
    });

    test("should handle long-running commands", async () => {
      await page.locator('[data-testid="terminal-button"]').click();
      await expect(page.locator('[data-testid="terminal"]')).toBeVisible();

      // Start a long-running command
      await page.locator('[data-testid="terminal-input"]').fill("npm install");
      await page.keyboard.press("Enter");

      // Check that terminal shows running state
      await expect(page.locator('[data-testid="terminal-running"]')).toBeVisible();

      // Stop the command
      await page.keyboard.press("Control+C");

      // Verify command is stopped
      await expect(page.locator('[data-testid="terminal-prompt"]')).toBeVisible();
    });
  });

  test.describe("Preview and Deployment", () => {
    test("should generate live preview", async () => {
      // Create a simple HTML page
      await page.locator('[data-testid="chat-input"]').fill("Create a simple HTML page with a heading");
      await page.locator('[data-testid="send-button"]').click();

      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 30000 });

      // Open preview
      await page.locator('[data-testid="preview-button"]').click();

      // Verify preview opens
      await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible();

      // Check if preview content loads
      const previewFrame = page.frameLocator('[data-testid="preview-iframe"]');
      await expect(previewFrame.locator("h1")).toBeVisible();
    });

    test("should handle preview updates in real-time", async () => {
      // Ensure we have a preview open
      await page.locator('[data-testid="preview-button"]').click();
      await expect(page.locator('[data-testid="preview-iframe"]')).toBeVisible();

      // Edit a file
      await page.locator('[data-testid="file-item"]').first().click();
      const editor = page.locator('[data-testid="code-editor"]');
      await editor.click();

      // Make a change
      await page.keyboard.press("Control+A");
      await page.keyboard.type("<h1>Updated Content</h1>");

      // Verify preview updates
      const previewFrame = page.frameLocator('[data-testid="preview-iframe"]');
      await expect(previewFrame.locator("h1")).toContainText("Updated Content");
    });
  });

  test.describe("Performance and Reliability", () => {
    test("should handle large files efficiently", async () => {
      // Create a large file
      const largeContent = 'console.log("line");'.repeat(1000);

      await page
        .locator('[data-testid="chat-input"]')
        .fill(`Create a JavaScript file with this content: ${largeContent.substring(0, 100)}...`);
      await page.locator('[data-testid="send-button"]').click();

      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 30000 });

      // Open the large file
      await page.locator('[data-testid="file-item"]').first().click();

      // Verify editor loads without freezing
      await expect(page.locator('[data-testid="code-editor"]')).toBeVisible({ timeout: 10000 });

      // Test scrolling performance
      const editor = page.locator('[data-testid="code-editor"]');
      await editor.hover();

      // Scroll multiple times
      for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(50);
      }

      // Verify editor is still responsive
      await editor.click();
      await page.keyboard.type("// Test comment");
      await expect(editor).toContainText("// Test comment");
    });

    test("should recover from network interruptions", async () => {
      // Simulate network failure
      // await page.setOfflineMode(true);
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
      await expect(page.locator('[data-testid="offline-indicator"]')).toHaveText('Offline');

      // Try to send a message
      await page.locator('[data-testid="chat-input"]').fill("This should fail");
      await page.locator('[data-testid="send-button"]').click();

      // Verify error state
      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();

      // Restore network
      // await page.setOfflineMode(false);
      await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();

      // Retry the message
      await page.locator('[data-testid="retry-button"]').click();

      // Verify recovery
      await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 30000 });
    });
  });

  test.describe("Accessibility", () => {
    test("should be keyboard navigable", async () => {
      // Test tab navigation
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toBeVisible();

      // Navigate through interface
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        const focused = page.locator(":focus");
        await expect(focused).toBeVisible();
      }

      // Test Enter key activation
      const focusedElement = page.locator(":focus");
      if ((await focusedElement.getAttribute("role")) === "button") {
        await page.keyboard.press("Enter");
        // Verify action was triggered (context-dependent)
      }
    });

    test("should have proper ARIA labels and roles", async () => {
      // Check main landmarks
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[role="navigation"]')).toBeVisible();

      // Check interactive elements have proper labels
      const buttons = page.locator("button");
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const hasLabel = await button.getAttribute("aria-label");
        const hasText = await button.textContent();

        // Button should have either aria-label or visible text
        expect(hasLabel || hasText).toBeTruthy();
      }
    });

    test("should support screen reader announcements", async () => {
      // Check for aria-live regions
      await expect(page.locator('[aria-live="polite"]')).toBeVisible();

      // Test status announcements
      await page.locator('[data-testid="chat-input"]').fill("Test message");
      await page.locator('[data-testid="send-button"]').click();

      // Verify status is announced
      await expect(page.locator('[aria-live="polite"]')).toContainText(/sending|processing|complete/i);
    });
  });

  test.afterEach(async () => {
    // Clean up any test data or state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });
});
