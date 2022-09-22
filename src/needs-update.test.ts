beforeEach(() => jest.resetModules());

test("no update required when equal", async () => {
  jest.mock("../package.json", () => ({ __esModule: true, default: { version: "1.0.0" } }), {
    virtual: true,
  });

  jest.mock("@octokit/rest", () => ({
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        repos: {
          getLatestRelease: jest.fn(async () => ({
            url: "",
            status: 200,
            headers: {},
            data: { name: "v1.0.0" },
          })),
        },
      },
    })),
  }));
  const { needsUpdate } = require("./needs-update");
  const { latestRelease } = require("./latest-release");
  const latestVersion = await latestRelease();
  const shouldUpdate = await needsUpdate(latestVersion);
  expect(shouldUpdate).toBe(false);
});

test("update required when upstream is newer", async () => {
  jest.mock("../package.json", () => ({ __esModule: true, default: { version: "1.0.0" } }), {
    virtual: true,
  });

  jest.mock("@octokit/rest", () => ({
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        repos: {
          getLatestRelease: jest.fn(async () => ({
            url: "",
            status: 200,
            headers: {},
            data: { name: "v1.0.1" },
          })),
        },
      },
    })),
  }));
  const { needsUpdate } = require("./needs-update");
  const { latestRelease } = require("./latest-release");
  const latestVersion = await latestRelease();
  const shouldUpdate = await needsUpdate(latestVersion);
  expect(shouldUpdate).toBe(true);
});

test("no update required when upstream is older", async () => {
  jest.mock("../package.json", () => ({ __esModule: true, default: { version: "2.0.0" } }), {
    virtual: true,
  });

  jest.mock("@octokit/rest", () => ({
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        repos: {
          getLatestRelease: jest.fn(async () => ({
            url: "",
            status: 200,
            headers: {},
            data: { name: "v1.0.0" },
          })),
        },
      },
    })),
  }));
  const { needsUpdate } = require("./needs-update");
  const { latestRelease } = require("./latest-release");
  const latestVersion = await latestRelease();
  const shouldUpdate = await needsUpdate(latestVersion);
  expect(shouldUpdate).toBe(false);
});

test("error is thrown when latest version is undefined", async () => {
  jest.mock("../package.json", () => ({ __esModule: true, default: { version: "1.0.0" } }), {
    virtual: true,
  });

  const { needsUpdate } = require("./needs-update");
  expect(needsUpdate(undefined)).rejects.toThrowError(TypeError);
});
