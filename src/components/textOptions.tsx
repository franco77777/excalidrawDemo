import { Slash } from "lucide-react";
import VerticalBar from "./verticalBar";
import ColorOptions from "./colorOptions";

const TextOptions = ({
  tool,
  colorText,
  setColorText,
  setTextSize,
  textSize,
}) => {
  const SetTextSize = (value) => {
    setTextSize(value);
  };
  return (
    <>
      <div
        className={`${tool === "text" ? "-top-10" : "top-0"}
  flex gap-2 items-center text-white h-10 w-[90%]  p-2 absolute -z-10  duration-300 ease-in-out rounded-t-lg left-1/2 -translate-x-1/2 bg-black border-x-[1px] border-t-[1px] border-gray-500`}
      >
        {/* <input
          type="text"
          className="w-10 h-6 text-white bg-black outline-none text-center border-[1px] border-gray-500 rounded"
          onChange={SetTextSize}
        /> */}
        <div
          onClick={() => SetTextSize(34)}
          data-size={34}
          className={`${
            textSize === 34 ? "bg-blue-500 scale-110" : "hover:scale-110"
          } duration-150 rounded px-[3px] h-fit cursor-pointer`}
        >
          H1
        </div>
        <div
          onClick={() => SetTextSize(30)}
          data-size={30}
          className={`${
            textSize === 30 ? "bg-blue-500 scale-110" : "hover:scale-110"
          } duration-150 rounded px-[3px] h-fit cursor-pointer`}
        >
          H2
        </div>
        <div
          onClick={() => SetTextSize(24)}
          data-size={24}
          className={`${
            textSize === 24 ? "bg-blue-500 scale-110" : "hover:scale-110"
          } duration-150 rounded px-[3px] h-fit cursor-pointer`}
        >
          H3
        </div>
        <div
          onClick={() => SetTextSize(20)}
          data-size={20}
          className={`${
            textSize === 20 ? "bg-blue-500 scale-110" : "hover:scale-110"
          } duration-150 rounded px-[3px] h-fit cursor-pointer`}
        >
          H4
        </div>
        <div
          onClick={() => SetTextSize(14)}
          data-size={14}
          className={`${
            textSize === 14 ? "bg-blue-500 scale-110" : "hover:scale-110"
          } duration-150 rounded px-[3px] h-fit cursor-pointer`}
        >
          H5
        </div>
        <div
          onClick={() => SetTextSize(10)}
          data-size={10}
          className={`${
            textSize === 10 ? "bg-blue-500 scale-110" : "hover:scale-110"
          } duration-150 rounded px-[3px] h-fit cursor-pointer`}
        >
          H6
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M11.6516 3.55982C11.9865 3.64354 12.1901 3.98288 12.1063 4.31775L9.10634 16.3177C9.02262 16.6526 8.68329 16.8562 8.34841 16.7725C8.01354 16.6888 7.80994 16.3495 7.89366 16.0146L10.8937 4.01458C10.9774 3.67971 11.3167 3.47611 11.6516 3.55982ZM5.94194 6.72422C6.18602 6.9683 6.18602 7.36403 5.94194 7.60811L3.38388 10.1662L5.94194 12.7242C6.18602 12.9683 6.18602 13.364 5.94194 13.6081C5.69786 13.8522 5.30214 13.8522 5.05806 13.6081L2.05806 10.6081C1.81398 10.364 1.81398 9.9683 2.05806 9.72422L5.05806 6.72422C5.30214 6.48014 5.69786 6.48014 5.94194 6.72422ZM14.0581 6.72422C14.3021 6.48014 14.6979 6.48014 14.9419 6.72422L17.9419 9.72422C18.186 9.9683 18.186 10.364 17.9419 10.6081L14.9419 13.6081C14.6979 13.8522 14.3021 13.8522 14.0581 13.6081C13.814 13.364 13.814 12.9683 14.0581 12.7242L16.6161 10.1662L14.0581 7.60811C13.814 7.36403 13.814 6.9683 14.0581 6.72422Z"
          ></path>
        </svg>
        <VerticalBar />
        <ColorOptions setColor={setColorText} color={colorText} />
      </div>
    </>
  );
};
export default TextOptions;
