import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import SaveBtn from "../header/SaveBtn";

export default function Modal(props) {
  const [name, setName] = useState("");
  const [scripts, setScripts] = useState([]);
  const [styles, setStyles] = useState([]);
  let [isOpen, setIsOpen] = useState(false);

  function handleOK() {
    props.onChange({ name, scripts, styles });
    setIsOpen(false);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setName(props.name);
    setStyles(props.styles || []);
    setScripts(props.scripts || []);
    setIsOpen(true);
  }

  const handleChangeStyles = (index, value) => {
    const newStyles = [...styles];
    newStyles[index] = value;
    setScripts(newStyles);
  };

  const handleChangeScripts = (index, value) => {
    const newScripts = [...scripts];
    newScripts[index] = value;
    setScripts(newScripts);
  };

  const handleRemoveStyles = (index) => {
    const newStyles = [...styles];
    newStyles.splice(index, 1);
    setStyles(newStyles);
  };

  const handleRemoveScripts = (index) => {
    const newScripts = [...scripts];
    newScripts.splice(index, 1);
    setScripts(newScripts);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded bg-[#181818] border border-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-100"
                  >
                    设置
                  </Dialog.Title>
                  <div className="text-gray-300 text-sm">
                    <div className="mt-3">
                      <div>项目名称</div>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p1-1 py-2 px-2 mt-1 rounded bg-gray-800 focus:outline-none"
                      />
                    </div>

                    <div className="mt-3">
                      <div>依赖样式</div>
                      {styles.map((s, i) => (
                        <div key={i} className="flex  mt-1">
                          <input
                            value={s}
                            onChange={(e) =>
                              handleChangeStyles(i, e.target.value)
                            }
                            placeholder="请填写CSS资源地址 http://"
                            className="flex-auto p1-1 py-2 px-2 rounded bg-gray-800 focus:outline-none"
                          />
                          <span
                            onClick={() => handleRemoveStyles(i)}
                            className="flex-none flex items-center cursor-pointer px-2"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </div>
                      ))}
                      <button
                        onClick={() => setStyles((prev) => [...prev, ""])}
                        className="text-blue-500 mt-2 flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4"
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
                        <span>添加</span>
                      </button>
                    </div>

                    <div className="mt-3">
                      <div>依赖JavaScript</div>
                      {scripts.map((s, i) => (
                        <div key={i} className="flex  mt-1">
                          <input
                            value={s}
                            key={i}
                            onChange={(e) =>
                              handleChangeScripts(i, e.target.value)
                            }
                            placeholder="请填写JS资源地址 http://"
                            className="w-full p1-1 py-2 px-2 mt-1 rounded bg-gray-800 focus:outline-none"
                          />
                          <span
                            onClick={() => handleRemoveScripts(i)}
                            className="flex-none flex items-center cursor-pointer px-2"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </div>
                      ))}
                      <button
                        onClick={() => setScripts((prev) => [...prev, ""])}
                        className="text-blue-500 mt-2 flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4"
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
                        <span>添加</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded border border-transparent bg-blue-500 px-5 py-2 text-sm font-medium text-blue-50 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleOK}
                    >
                      确定
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
