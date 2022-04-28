/* eslint-disable @next/next/no-img-element */
import React from "react";
import QRCode from "qrcode";

export default function QrcodePage() {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState("");
  const [colorDark, setColorDark] = React.useState("#000000");
  const [colorLight, setColorLight] = React.useState("#ffffff");
  const [qrcode, setQrcode] = React.useState(
    "https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=302&__biz=Mzg4MTcyNDY4OQ==&mid=2247487204&idx=1&sn=b8b9b38fe6f172fdc4b68bac08d3cfd4&send_time="
  );

  const handleInputChange = async (e) => {
    setInput(e.target.value);
    console.log(colorDark);
    try {
      const dataURL = await QRCode.toDataURL(e.target.value, {
        width: 300,
        margin: 3,
        color: {
          dark: colorDark,
          light: colorLight,
        },
      });
      setQrcode(dataURL);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="h-screen max-w-5xl m-auto">
      <div className="flex text-3xl p-4 border-b">二维码生成器</div>
      <div className="flex">
        <div className="flex-1 p-4">
          <textarea
            rows={10}
            id="input-el"
            className="w-full border bg-white input p-3"
            value={input}
            onChange={handleInputChange}
          ></textarea>
          {error ? (
            <div
              className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700"
              role="alert"
            >
              <svg
                className="w-5 h-5 inline mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <div>{error}</div>
            </div>
          ) : null}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between w-60 mb-2">
            <input
              type="color"
              onChange={(e) => setColorDark(e.target.value)}
              value={colorDark}
            />
            <input
              type="color"
              onChange={(e) => setColorLight(e.target.value)}
              value={colorLight}
            />
            <a
              className=" text-blue-600 underline"
              download="qrcode.png"
              href={qrcode}
            >
              下载
            </a>
          </div>
          {qrcode && (
            <img
              alt="qrcode"
              className="border rounded w-60 h-60"
              src={qrcode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
