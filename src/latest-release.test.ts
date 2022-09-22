beforeEach(() => jest.resetModules());

test("version is parsed", async () => {
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
  const { latestRelease } = require("./latest-release");
  const latest = await latestRelease();
  expect(latest).toBe("1.0.0");
});

test("error is passed through", async () => {
  jest.mock("@octokit/rest", () => ({
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        repos: {
          getLatestRelease: jest.fn(async () => {
            throw new Error("Octokit threw");
          }),
        },
      },
    })),
  }));
  const { latestRelease } = require("./latest-release");
  expect(latestRelease()).rejects.toThrowError(Error);
});

test("version is undefined when name is missing", async () => {
  jest.mock("@octokit/rest", () => ({
    Octokit: jest.fn().mockImplementation(() => ({
      rest: {
        repos: {
          getLatestRelease: jest.fn(async () => ({
            url: "",
            status: 200,
            headers: {},
            data: {},
          })),
        },
      },
    })),
  }));
  const { latestRelease } = require("./latest-release");
  const latest = await latestRelease();
  expect(latest).toBeUndefined();
});
