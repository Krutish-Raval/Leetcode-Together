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
// import puppeteer from "puppeteer";
// import fs from "fs/promises";
// import dotenv from "dotenv";
// dotenv.config();

// const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME;
// const LEETCODE_PASSWORD = process.env.LEETCODE_PASSWORD;

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false, // visible browser so you can manually solve captcha
//     defaultViewport: null,
//     args: ["--start-maximized"],
//   });

//   const page = await browser.newPage();
//   await page.goto("https://leetcode.com/accounts/login/", { waitUntil: "networkidle2" });

//   try {
//     // Wait for username input and type
//     await page.waitForSelector('input[placeholder="Username or E-mail"]', { timeout: 10000 });
//     await page.type('input[placeholder="Username or E-mail"]', LEETCODE_USERNAME, { delay: 300 });

//     // Wait for password input and type
//     await page.waitForSelector('input[placeholder="Password"]', { timeout: 10000 });
//     await page.type('input[placeholder="Password"]', LEETCODE_PASSWORD, { delay: 300 });

//     // Wait for and click the sign-in button
//     await page.waitForSelector('#signin_btn', { timeout: 10000 });
//     await page.click('#signin_btn');

//     console.log("🔐 Waiting 60 seconds for captcha (if present)...");
//     await new Promise(resolve => setTimeout(resolve, 60000));

//     const cookies = await page.cookies();
//     const sessionCookie = cookies.find(c => c.name === "LEETCODE_SESSION");

//     if (sessionCookie) {
//       await fs.writeFile(".leetcode_session", sessionCookie.value);
//       console.log(`✅ LEETCODE_SESSION: ${sessionCookie.value}`);
//       console.log("✅ LEETCODE_SESSION saved!");
//     } else {
//       console.error("❌ LEETCODE_SESSION not found. Possibly blocked by captcha.");
//     }

//   } catch (err) {
//     console.error("❌ Login process failed:", err.message);
//   } finally {
//     await browser.close();
//   }
// })();
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

const USER_DATA_DIR = "C:\\Users\\Krutish Raval\\AppData\\Local\\Google\\Chrome\\User Data"; // Update this path

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: USER_DATA_DIR,
    defaultViewport: null,
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  // Go to LeetCode (you should already be logged in here)
  await page.goto("https://leetcode.com/", { waitUntil: "networkidle2" });

  const cookies = await page.cookies();
  const sessionCookie = cookies.find(c => c.name === "LEETCODE_SESSION");

  if (sessionCookie) {
    await fs.writeFile(".leetcode_session", sessionCookie.value);
    console.log(`✅ LEETCODE_SESSION: ${sessionCookie.value}`);
    console.log("✅ LEETCODE_SESSION saved!");
  } else {
    console.error("❌ LEETCODE_SESSION not found. Are you logged in?");
  }

  await browser.close();
})();
