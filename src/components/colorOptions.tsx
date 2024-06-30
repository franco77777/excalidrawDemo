const ColorOptions = ({ color, setColor }) => {
  const handleColor = (e) => {
    const Target = e.target as HTMLElement;
    const Color = Target.getAttribute("value");
    setColor(Color);
  };
  return (
    <ul className="flex gap-2">
      <li
        onClick={handleColor}
        value="rgb(255 255 255)"
        className={`${
          color === "rgb(255 255 255)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-white`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(59 130 246)"
        className={`${
          color === "rgb(59 130 246)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-blue-500`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(34 197 94)"
        className={`${
          color === "rgb(34 197 94)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-green-500`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(239 68 68)"
        className={`${
          color === "rgb(239 68 68)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-red-500`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(249 115 22)"
        className={`${
          color === "rgb(249 115 22)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-orange-500`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(234 179 8)"
        className={`${
          color === "rgb(234 179 8)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-yellow-500`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(168 85 247)"
        className={`${
          color === "rgb(168 85 247)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-purple-500`}
      ></li>
      <li
        onClick={handleColor}
        value="rgb(236 72 153)"
        className={`${
          color === "rgb(236 72 153)" ? "scale-150" : "hover:scale-125"
        } duration-150 ease-in-out cursor-pointer w-4 h-4 rounded-full bg-pink-500`}
      ></li>
    </ul>
  );
};
export default ColorOptions;
