export const domain =
  {
    production: "plobbo.com",
    dev: "dev.plobbo.com",
    sandbox: "sandbox.plobbo.com",
  }[$app.stage] ?? $app.stage + ".dev.plobbo.com";

export const altDomain =
  {
    production: "blogmedaddy.com",
    dev: "dev.blogmedaddy.com",
    sandbox: "sandbox.blogmedaddy.com",
  }[$app.stage] ?? $app.stage + ".dev.blogmedaddy.com";
