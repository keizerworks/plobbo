export const domain =
  {
    production: "plobbo.com",
    dev: "dev.plobbo.com",
    sandbox: "sandbox.plobbo.com",
  }[$app.stage] ?? $app.stage + ".dev.plobbo.com";
