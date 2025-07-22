// import puppeteer from "puppeteer";
// import fs from "fs/promises";
// import dotenv from "dotenv";
// dotenv.config();

// const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME;
// const LEETCODE_PASSWORD = process.env.LEETCODE_PASSWORD;

// (async () => {
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   await page.goto("https://leetcode.com/accounts/login/");

//   await page.type("#id_login", LEETCODE_USERNAME, { delay: 30 });
//   await page.type("#id_password", LEETCODE_PASSWORD, { delay: 30 });
//   await page.click("button[type='submit']");
//   await page.waitForNavigation({ waitUntil: "networkidle2" });

//   const cookies = await page.cookies();
//   const sessionCookie = cookies.find(c => c.name === "LEETCODE_SESSION");

//   if (sessionCookie) {
//     await fs.writeFile(".leetcode_session", sessionCookie.value);
//     console.log("✅ LEETCODE_SESSION saved!");
//   } else {
//     console.error("❌ Could not find LEETCODE_SESSION");
//   }

//   await browser.close();
// })();
import puppeteer from "puppeteer";
import fs from "fs/promises";

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // keep browser visible
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.goto("https://leetcode.com/accounts/login", { waitUntil: "networkidle2" });

  console.log("🔓 You have 20 seconds to log in manually...");
  await new Promise((res) => setTimeout(res, 20000)); // 20 seconds for manual login

  const cookies = await page.cookies();
  const sessionCookie = cookies.find((c) => c.name === "LEETCODE_SESSION");

  if (sessionCookie) {
    await fs.writeFile(".leetcode_session", sessionCookie.value);
    console.log("✅ LEETCODE_SESSION saved to .leetcode_session");
  } else {
    console.error("❌ Could not find LEETCODE_SESSION after login");
  }

  await browser.close();
})();

