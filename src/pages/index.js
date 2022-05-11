/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Header from "../components/header";
import { list } from "../utils/database";

export default function Home({ data, imgList }) {
  return (
    <>
      <Header></Header>
      <div className="container mx-auto pb-5 min-h-fit">
        <div className="p-5 flex">
          <Link href="/pen/create">
            <a>
              <button className="flex text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
                <svg
                  className="w-6 h-6 flex-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>新建代码片段</span>
              </button>
            </a>
          </Link>
        </div>
        <div className="flex flex-wrap text-slate-400">
          {data.map((item, index) => (
            <Link key={item._id} href={`/pen/${item._id}`}>
              <a className="xl:w-1/4 md:w-1/2 p-4">
                <div className="relative flex flex-col rounded-lg p-6 bg-slate-800 highlight-white/5">
                  <img
                    className="h-40 rounded w-full object-cover object-center mb-6"
                    src={imgList[index]}
                    alt="content"
                  />
                  <h3 className="tracking-widest text-blue-500 text-xs font-medium title-font">
                    react
                  </h3>
                  <h2 className="text-lg  font-medium title-font mb-4">
                    {item.name || "项目未命名"}
                  </h2>
                  <p className="leading-relaxed text-base">项目描述</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <footer className="bg-[#181818] border-t border-gray-700 text-gray-400">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-sm text-center sm:text-left">
            © 2022 http://code.runjs.cool —
            <a
              href="https://twitter.com/knyttneve"
              className="ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              @maqibin
            </a>
          </p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center  text-sm">
            欢迎关注微信公众号@JS酷
          </span>
        </div>
      </footer>
    </>
  );
}

export async function getServerSideProps({ params, res, query }) {
  try {
    const result = await list();
    return {
      props: {
        data: result.data,
        imgList: result.imgList,
      },
    };
  } catch (error) {
    return {
      props: {
        errorCode: error.status || 500,
      },
    };
  }
}
