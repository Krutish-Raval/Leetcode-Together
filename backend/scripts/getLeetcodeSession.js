import puppeteer from "puppeteer";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME;
const LEETCODE_PASSWORD = process.env.LEETCODE_PASSWORD;

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://leetcode.com/accounts/login/");

  await page.type("#id_login", LEETCODE_USERNAME, { delay: 30 });
  await page.type("#id_password", LEETCODE_PASSWORD, { delay: 30 });
  await page.click("button[type='submit']");
  await page.waitForNavigation();

  const cookies = await page.cookies();
  const sessionCookie = cookies.find(c => c.name === "LEETCODE_SESSION");

  if (sessionCookie) {
    await fs.writeFile(".leetcode_session", sessionCookie.value);
    console.log("✅ LEETCODE_SESSION saved!");
  } else {
    console.error("❌ Could not find LEETCODE_SESSION");
  }

  await browser.close();
})();
