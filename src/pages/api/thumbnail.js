import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

const getAbsoluteURL = (path) => {
  const baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return baseURL + path;
};

export default async function handler(req, res) {
  // Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  // 创建一个页面，并设置视窗大小
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 630,
    },
  });
  // 从url path 拼接成完成路径
  const url = getAbsoluteURL(req.query["path"] || "");
  await page.goto(url, {
    timeout: 15 * 1000,
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1000);
  // 生成png 的缩略图
  const data = await page.screenshot({
    type: "png",
  });
  await browser.close();
  // 设置图片强缓存
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
  res.setHeader("Content-Type", "image/png");
  // 设置返回 Content-Type 图片格式
  res.end(data);
}
