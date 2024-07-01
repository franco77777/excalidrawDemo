import { Slash } from "lucide-react";
import VerticalBar from "./verticalBar";
import ColorOptions from "./colorOptions";

const ShapeOptions = ({
  tool,
  colorShape,
  setColorShape,
  setFillStyle,
  fillStyle,
  setTool,
}) => {
  return (
    <>
      <div
        className={`${
          tool === "rectangle" || tool === "circle" || tool === "triangle"
            ? "-top-10"
            : "top-0"
        }
  flex gap-2 items-center text-white h-10 w-[90%]  p-2 absolute -z-10  duration-300 ease-in-out rounded-t-lg left-1/2 -translate-x-1/2 bg-black border-x-[1px] border-t-[1px] border-gray-500`}
      >
        <svg
          onClick={() => setFillStyle(false)}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            fillStyle ? "hover:scale-110" : "bg-blue-500 scale-110"
          } cursor-pointer  duration-150 rounded `}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M3.39177 2.9553C3.6006 2.68046 3.9927 2.62696 4.26753 2.83579C9.95831 7.15993 14.1901 12.9846 15.8532 16.3578C16.0058 16.6674 15.8786 17.0421 15.569 17.1948C15.2594 17.3474 14.8847 17.2202 14.7321 16.9106C13.1515 13.7047 9.04214 8.0337 3.51127 3.83107C3.23644 3.62223 3.18293 3.23014 3.39177 2.9553Z"
          ></path>
        </svg>

        <svg
          onClick={() => setFillStyle(true)}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            fillStyle ? "bg-blue-500 scale-110" : "hover:scale-110"
          } cursor-pointer  duration-150 rounded `}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M2.7244 3.19359C2.80201 2.85725 3.13759 2.64751 3.47393 2.72513C8.98708 3.99739 13.9297 6.80233 16.2292 8.68373C16.5303 8.93011 16.7797 9.18308 16.9343 9.44907C17.0965 9.72811 17.1885 10.0903 17.0251 10.4573C16.8794 10.7848 16.5897 10.972 16.3532 11.0832C16.1035 11.2007 15.8045 11.2839 15.4933 11.3483C14.8692 11.4775 14.0641 11.5565 13.211 11.6286C13.0041 11.646 12.7937 11.6632 12.5807 11.6805C11.8997 11.7359 11.1915 11.7936 10.4857 11.872C8.6165 12.0797 7.12382 12.3464 6.2104 12.666C5.84171 12.795 5.63227 12.9113 5.52734 12.9914C5.86905 13.3958 6.43971 13.7994 7.16558 14.1805C7.90858 14.5706 8.76171 14.9103 9.57823 15.191C10.3927 15.4709 11.1581 15.6879 11.7206 15.8349C12.0015 15.9083 12.2308 15.964 12.3891 16.0013C12.4683 16.0199 12.5296 16.0338 12.5708 16.043L12.617 16.0533L12.6281 16.0557L12.6306 16.0562C12.9681 16.1286 13.1835 16.4609 13.1112 16.7984C13.0389 17.1359 12.7066 17.3509 12.3691 17.2786L12.5001 16.6675C12.3691 17.2786 12.3692 17.2786 12.3691 17.2786L12.3674 17.2782L12.3635 17.2774L12.3495 17.2743L12.2975 17.2628C12.2524 17.2527 12.1868 17.2377 12.1032 17.2181C11.936 17.1788 11.6966 17.1206 11.4045 17.0443C10.8212 16.8918 10.0241 16.6661 9.17188 16.3731C8.32174 16.0809 7.40404 15.7175 6.58454 15.2872C5.77645 14.863 5.00904 14.3458 4.51201 13.7246C4.35483 13.5281 4.22952 13.2782 4.22579 12.9843C4.22198 12.6841 4.34606 12.4334 4.50705 12.2436C4.80009 11.8982 5.29046 11.6635 5.79762 11.4861C6.85378 11.1166 8.46695 10.8386 10.3477 10.6296C11.0736 10.549 11.8076 10.4892 12.492 10.4336C12.7018 10.4165 12.9069 10.3998 13.1057 10.383C13.9678 10.3102 14.7002 10.236 15.2399 10.1243C15.4794 10.0747 15.6554 10.0226 15.7766 9.97188C15.7097 9.89286 15.6027 9.78628 15.4376 9.65118C13.2821 7.88756 8.51304 5.17085 3.19285 3.94312C2.85651 3.8655 2.64678 3.52992 2.7244 3.19359Z"
          ></path>
        </svg>
        <VerticalBar />
        <svg
          onClick={() => setTool("rectangle")}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            tool === "rectangle" ? "bg-blue-500 scale-110" : "hover:scale-110"
          } cursor-pointer  duration-150 rounded`}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M2.70825 2.70898H17.2916V17.2923H2.70825V2.70898ZM3.95825 3.95898V16.0423H16.0416V3.95898H3.95825Z"
          ></path>
        </svg>
        <svg
          onClick={() => setTool("circle")}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            tool === "circle" ? "bg-blue-500 scale-110" : "hover:scale-110"
          } cursor-pointer  duration-150 rounded`}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M10 3.125C6.20304 3.125 3.125 6.20304 3.125 10C3.125 13.797 6.20304 16.875 10 16.875C13.797 16.875 16.875 13.797 16.875 10C16.875 6.20304 13.797 3.125 10 3.125ZM1.875 10C1.875 5.51269 5.51269 1.875 10 1.875C14.4873 1.875 18.125 5.51269 18.125 10C18.125 14.4873 14.4873 18.125 10 18.125C5.51269 18.125 1.875 14.4873 1.875 10Z"
          ></path>
        </svg>
        <svg
          onClick={() => setTool("triangle")}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            tool === "triangle" ? "bg-blue-500 scale-110" : "hover:scale-110"
          } cursor-pointer  duration-150 rounded`}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M10.0001 2.08398L18.2995 16.459H1.70068L10.0001 2.08398ZM10.0001 4.58398L3.86575 15.209H16.1344L10.0001 4.58398Z"
          ></path>
        </svg>
        <VerticalBar />
        <ColorOptions setColor={setColorShape} color={colorShape} />
      </div>
    </>
  );
};
export default ShapeOptions;
