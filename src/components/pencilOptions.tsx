import { Slash } from "lucide-react";
import VerticalBar from "./verticalBar";
import ColorOptions from "./colorOptions";

const PencilOptions = ({
  tool,
  colorPencil,
  setColorPencil,
  setPencilWidth,
}) => {
  const SetPencilWidth = (e) => {
    setPencilWidth(e.target.value);
  };
  return (
    <>
      <div
        className={`${tool === "pencil" ? "-top-10" : "top-0"}
  flex gap-4 items-center text-white h-10 w-[90%]  p-2 absolute -z-10  duration-300 ease-in-out rounded-t-lg left-1/2 -translate-x-1/2 bg-black border-x-[1px] border-t-[1px] border-gray-500`}
      >
        <input
          type="range"
          defaultValue={10}
          min={1}
          max={20}
          className="w-28 h-1"
          onChange={SetPencilWidth}
        />
        <VerticalBar />
        <ColorOptions setColor={setColorPencil} color={colorPencil} />
      </div>
    </>
  );
};
export default PencilOptions;
