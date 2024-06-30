import { Slash } from "lucide-react";
import VerticalBar from "./verticalBar";
import ColorOptions from "./colorOptions";

const TextOptions = ({
  tool,
  colorText,
  setColorText,
  setTextSize,
  selectedElement,
}) => {
  const SetTextSize = (e) => {
    setTextSize(e.target.value);
  };
  return (
    <>
      <div
        className={`${tool === "text" ? "-top-10" : "top-0"}
  flex gap-4 items-center text-white h-10 w-[90%]  p-2 absolute -z-10  duration-300 ease-in-out rounded-t-lg left-1/2 -translate-x-1/2 bg-black border-x-[1px] border-t-[1px] border-gray-500`}
      >
        {/* <input
          type="text"
          className="w-10 h-6 text-white bg-black outline-none text-center border-[1px] border-gray-500 rounded"
          onChange={SetTextSize}
        /> */}
        <VerticalBar />
        <ColorOptions setColor={setColorText} color={colorText} />
      </div>
    </>
  );
};
export default TextOptions;
