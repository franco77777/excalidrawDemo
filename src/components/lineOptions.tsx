import { Slash } from "lucide-react";
import VerticalBar from "./verticalBar";
import ColorOptions from "./colorOptions";

const LineOptions = ({ tool, colorLine, setColorLine, setLineWidth }) => {
  const SetLineWidth = (e) => {
    setLineWidth(e.target.value);
  };
  return (
    <>
      <div
        className={`${tool === "line" ? "-top-10" : "top-0"}
  flex gap-4 items-center text-white h-10 w-[90%]  p-2 absolute -z-10  duration-300 ease-in-out rounded-t-lg left-1/2 -translate-x-1/2 bg-black border-x-[1px] border-t-[1px] border-gray-500`}
      >
        <Slash />
        <VerticalBar />
        <input
          type="range"
          defaultValue={1}
          min={1}
          max={10}
          className="w-28 h-1"
          onChange={SetLineWidth}
        />
        <VerticalBar />
        <ColorOptions setColor={setColorLine} color={colorLine} />
      </div>
    </>
  );
};
export default LineOptions;
