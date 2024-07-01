import { useEffect, useLayoutEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import getStroke from "perfect-freehand";
import Select from "./components/select";
import Line from "./components/line";
import Pencil from "./components/pencil";
import Eraser from "./components/eraser";
import Shape from "./components/shape";
import Text from "./components/text";
import ImageBar from "./components/image";

import LineOptions from "./components/lineOptions";
import PencilOptions from "./components/pencilOptions";
import ShapeOptions from "./components/shapeOptions";
import TextOptions from "./components/textOptions";

const useHistory = (initialState) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);
  // console.log("index", index);
  // console.log("history", history);
  // console.log("historyindex", history[index]);
  const setState = (action, overwrite = false) => {
    // console.log("action", action);
    // console.log("overwrite", overwrite);

    const newState =
      typeof action === "function" ? action(history[index]) : action;

    //console.log("newstate", newState);

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      //setHistory((prevState) => [...prevState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };
  //console.log("history", history);
  //console.log("index", index);
  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};
const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prevKeys) => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};
function App() {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState();
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const textAreaRef = useRef();
  const pressedKeys = usePressedKeys();
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState("");

  const [colorLine, setColorLine] = useState("rgb(255 255 255)");
  const [lineWidth, setLineWidth] = useState(1);
  const [pencilWidth, setPencilWidth] = useState(10);
  const [colorPencil, setColorPencil] = useState("rgb(255 255 255)");
  const [colorShape, setColorShape] = useState("rgb(255 255 255)");
  const [colorText, setColorText] = useState("rgb(255 255 255)");
  const [textSize, setTextSize] = useState(24);
  const [fillStyle, setFillStyle] = useState(false);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    console.log("canvas height", canvas.height);
    console.log("canvas width", canvas.width);

    const scaleHeight = canvas.height * scale;
    const scaleWidth = canvas.width * scale;
    // 559 908
    const scaleOffsetX = (scaleWidth - canvas.width) / 2; //454
    const scaleOffsetY = (scaleHeight - canvas.height) / 2; //280

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;

    //change the size of one rectangle, then redraw both of them

    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
    ctx.save();
    ctx.translate(
      panOffset.x * scale - scaleOffsetX,
      panOffset.y * scale - scaleOffsetY
    );
    ctx.scale(scale, scale);
    elements.forEach((e) => {
      if (action === "writing" && selectedElement.id === e.id) return;
      createElement(e);
    });
    ctx.restore();
  }, [elements, action, selectedElement, panOffset, scale]);
  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        undo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "y") {
        redo();
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      setTimeout(() => {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 0);
    }
  }, [action, selectedElement]);
  useEffect(() => {
    const panOrZoomFunction = (event) => {
      if (pressedKeys.has("Meta") || pressedKeys.has("Control")) {
        onZoom(event.deltaY * -0.01);
      } else
        setPanOffset((prevState) => ({
          x: prevState.x - event.deltaX,
          y: prevState.y - event.deltaY,
        }));
    };

    document.addEventListener("wheel", panOrZoomFunction);
    return () => {
      document.removeEventListener("wheel", panOrZoomFunction);
    };
  }, [pressedKeys]);
  useLayoutEffect(() => {
    document.getElementById("root").addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey) {
          event.preventDefault();
        }
      },
      true
    );
  }, []);
  const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  };
  const createElement = async (element) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const minX = Math.min(element.x1, element.x2);
    const maxX = Math.max(element.x1, element.x2);
    const minY = Math.min(element.y1, element.y2);
    const maxY = Math.max(element.y1, element.y2);
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;
    switch (element.type) {
      case "triangle": {
        ctx.beginPath();
        ctx.moveTo(centerX, minY);
        ctx.lineTo(maxX, maxY);
        ctx.lineTo(minX, maxY);
        ctx.lineTo(centerX, minY);

        ctx.stroke();
        if (element.fillStyle) {
          ctx.fillStyle = element.color;
          ctx.strokeStyle = element.color;
          ctx.fill();
        } else {
          ctx.strokeStyle = element.color;
        }
        ctx.stroke();
        ctx.closePath();
        break;
      }
      case "circle": {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          width / 2,
          height / 2,
          Math.PI / 180,
          0,
          2 * Math.PI
        );
        if (element.fillStyle) {
          ctx.fillStyle = element.color;
          ctx.strokeStyle = "transparent";
          ctx.fill();
          ctx.stroke();
          break;
        } else {
          ctx.strokeStyle = element.color;
          ctx.stroke();
          break;
        }
      }

      case "line":
        ctx.beginPath();
        ctx.strokeStyle = element.color;
        ctx.lineWidth = element.lineWidth;
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
        break;
      case "rectangle":
        if (element.fillStyle) {
          ctx.beginPath();
          ctx.rect(
            element.x1,
            element.y1,
            element.x2 - element.x1,
            element.y2 - element.y1
          );
          ctx.fillStyle = element.color;
          ctx.fill();
        } else {
          ctx.beginPath();

          ctx.strokeStyle = element.color;
          ctx.strokeRect(
            element.x1,
            element.y1,
            element.x2 - element.x1,
            element.y2 - element.y1
          );
        }

        break;
      case "pencil":
        {
          const stroke = getSvgPathFromStroke(
            getStroke(element.points, {
              size: element.pencilWidth,
            })
          );
          ctx.fillStyle = element.colorPencil;
          ctx.fill(new Path2D(stroke));
        }

        break;
      case "text":
        {
          ctx.beginPath();
          ctx.fillStyle = element.color;
          ctx.textBaseline = "top";
          ctx.font = `${element.size}px sans-serif`;
          ctx.fillText(element.text, element.x1, element.y1);
        }
        break;
      case "image":
        {
          const image = new Image();
          image.src = element.src;

          ctx.drawImage(
            image,
            element.x1,
            element.y1,
            element.x2 - element.x1,
            element.y2 - element.y1
          );
        }
        break;
      default:
        break;
    }
  };
  const distance = (a, b) => {
    const result = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return result;
  };

  const nearPoint = (clientX, clientY, x1, y1, name) => {
    return Math.abs(clientX - x1) < 5 && Math.abs(clientY - y1) < 5
      ? name
      : null;
  };
  const onLine = (x1, y1, x2, y2, clientX, clientY, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: clientX, y: clientY };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
  };
  const positionWithinElement = (clientX, clientY, element) => {
    const { type, x1, y1, x2, y2 } = element;
    switch (type) {
      case "line": {
        const on = onLine(x1, y1, x2, y2, clientX, clientY);
        const start = nearPoint(clientX, clientY, x1, y1, "start");
        const end = nearPoint(clientX, clientY, x2, y2, "end");

        return start || end || on;
      }
      case "image":
      case "circle":
      case "triangle":
      case "rectangle": {
        const topLeft = nearPoint(clientX, clientY, x1, y1, "tl");
        const topRight = nearPoint(clientX, clientY, x2, y1, "tr");
        const bottomLeft = nearPoint(clientX, clientY, x1, y2, "bl");
        const bottomRight = nearPoint(clientX, clientY, x2, y2, "br");
        const inside =
          clientX >= x1 && clientX <= x2 && clientY >= y1 && clientY <= y2
            ? "inside"
            : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      }

      case "pencil": {
        const betweenAnyPoint = element.points.some((point, index) => {
          const nextPoint = element.points[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(
              point.x,
              point.y,
              nextPoint.x,
              nextPoint.y,
              clientX,
              clientY,
              5
            ) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      }

      case "text":
        return clientX >= x1 && clientX <= x2 && clientY >= y1 && clientY <= y2
          ? "inside"
          : null;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const getElementAtPosition = (clientX, clientY, elements) => {
    return elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(clientX, clientY, element),
      }))
      .find((element) => element.position !== null);
  };
  const generateElementType = (clientX, clientY) => {
    let id;
    if (elements.length !== 0) {
      id = elements[elements.length - 1].id + 1;
    } else {
      id = 1;
    }
    switch (tool) {
      case "triangle":
      case "rectangle":
      case "circle": {
        const newElement = {
          fillStyle,

          color: colorShape,
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          type: tool,
          id: id,
        };
        return newElement;
      }
      case "line": {
        const newElement = {
          lineWidth,
          color: colorLine,
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          type: tool,
          id: id,
        };
        return newElement;
      }
      case "pencil": {
        const newElement = {
          colorPencil,
          pencilWidth,
          points: [{ x: clientX, y: clientY }],
          type: tool,
          id: id,
        };
        return newElement;
      }
      case "text": {
        const newElement = {
          x1: clientX,
          y1: clientY,
          color: colorText,
          size: textSize,
          text: "",
          type: tool,
          id: id,
        };
        return newElement;
      }
      case "image": {
        if (!imageUrl) return "";

        const img = document.getElementById("img");

        const input = document.getElementById("inputFile");
        input.value = null;
        let divider = 0;

        const width = img.naturalWidth;
        const height = img.naturalHeight;
        if (width > 500 || height > 500) divider = 2;
        if (width > 1000 || height > 1000) divider = 3;
        if (width > 1500 || height > 1500) divider = 4;
        if (width > 2000 || height > 2000) divider = 5;
        const X = divider ? width / divider : width;
        const Y = divider ? height / divider : height;
        const offsetX = X / 2;
        const offsetY = Y / 2;
        console.log("X", X);
        console.log("Y", Y);
        console.log("width", width);
        console.log("dheight", height);

        console.log("divider", divider);
        img.src = "";
        const newElement = {
          x1: clientX - offsetX,
          y1: clientY - offsetY,
          x2: clientX + offsetX,
          y2: clientY + offsetY,
          src: imageUrl,
          type: tool,
          id: id,
        };

        return newElement;
      }
      default:
        break;
    }
  };
  console.log("selectedElement", selectedElement);
  const getMouseCoordinates = (event) => {
    const clientX =
      (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY =
      (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
    return { clientX, clientY };
  };
  const handleMouseDown = (e) => {
    if (action === "writing") return;

    const { clientX, clientY } = getMouseCoordinates(e);

    if (e.button === 1 || pressedKeys.has(" ")) {
      setAction("panning");
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }
    if (tool === "eraser") {
      setAction("erasing");
      return;
    }
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;

          setSelectedElement({ ...element, offsetX, offsetY });
        }

        setElements((prevState) => prevState);

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const newElement = generateElementType(clientX, clientY);
      console.log("newElement", newElement);
      if (newElement) {
        console.log("entering");

        setSelectedElement(newElement);
        setElements((state) => [...state, newElement]);
        setImageUrl("");
        if (action === "addingImage") return;
        setAction(tool === "text" ? "writing" : "drawning");
      }
    }
  };

  const cursorForPosition = (position) => {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "move";
    }
  };
  const resizedCoordinates = (clientX, clientY, position, coordinates) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2, y2 };
      case "tr":
        return { x1, y1: clientY, x2: clientX, y2 };
      case "bl":
        return { x1: clientX, y1, x2, y2: clientY };
      case "br":
      case "end":
        return { x1, y1, x2: clientX, y2: clientY };
      default:
        return null; //should not really get here...
    }
  };

  const handleMouseMove = (e) => {
    if (action === "addingImage") return;
    const { clientX, clientY } = getMouseCoordinates(e);
    const element = getElementAtPosition(clientX, clientY, elements);
    if (tool === "selection")
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      return;
    }

    if (action === "drawning") {
      const { id, type } = selectedElement;
      const elementsCopy = [...elements];
      const currentElement = elementsCopy[elements.length - 1];
      if (type === "pencil") {
        currentElement.points = [
          ...currentElement.points,
          { x: clientX, y: clientY },
        ];
      } else {
        currentElement.x2 = clientX;
        currentElement.y2 = clientY;
      }

      setElements(elementsCopy, true);
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        const index = elements.findIndex((e) => e.id === selectedElement.id);
        elementsCopy[index] = {
          ...elementsCopy[index],
          points: newPoints,
        };

        setElements(elementsCopy, true);
      } else {
        const { id, x1, y1, x2, y2, offsetX, offsetY, text } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const nextX1 = clientX - offsetX;
        const nextY1 = clientY - offsetY;

        updateElement(
          id,
          nextX1,
          nextY1,
          nextX1 + width,
          nextY1 + height,
          text
        );
      }
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;

      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2);
    } else if (action === "erasing") {
      if (element) {
        const { id } = element;
        const ElementsCopy = [...elements];
        const newElements = ElementsCopy.filter((e) => e.id !== id);
        setElements(newElements);
      }
    }
  };
  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };
  const updateElement = (id, x1, y1, x2, y2, text = "null") => {
    const copyElements = [...elements];
    const elementForUpdate = copyElements.find((e) => e.id === id);
    const index = copyElements.findIndex((e) => e.id === id);
    let newElement;
    switch (elementForUpdate.type) {
      case "rectangle":
      case "triangle":
      case "circle":
      case "line":
        {
          newElement = {
            fillStyle: elementForUpdate.fillStyle,
            lineWidth: elementForUpdate.lineWidth,
            color: elementForUpdate.color,
            x1,
            y1,
            x2,
            y2,
            type: elementForUpdate.type,
            id,
          };
        }
        break;
      case "image":
        {
          newElement = {
            x1,
            y1,
            x2,
            y2,
            type: elementForUpdate.type,
            src: elementForUpdate.src,
            id,
          };
        }
        break;
      case "text":
        {
          const ctx = document.getElementById("canvas").getContext("2d");
          const textHeight = elementForUpdate.size;
          ctx.font = `${textHeight}px sans-serif`;
          const textWidth = ctx.measureText(text).width;
          //const textHeight = ctx.measureText('M').width;

          newElement = {
            color: elementForUpdate.color,
            size: textHeight,
            x1,
            y1,
            x2: x1 + textWidth,
            y2: y1 + Number.parseInt(textHeight),
            text,
            type: elementForUpdate.type,
            id,
          };
        }
        break;
      default:
        break;
    }

    copyElements[index] = newElement;

    setElements(copyElements, true);
  };

  const handleMouseUp = (e) => {
    const { clientX, clientY } = getMouseCoordinates(e);

    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
      if (action === "drawning" || action === "resizing") {
        const id = selectedElement.id;
        const currentElement = elements.find((e) => e.id === id);
        const { x1, y1, x2, y2 } = adjustElementCoordinates(currentElement);
        if (tool !== "pencil" && tool !== "text" && tool !== "image")
          updateElement(id, x1, y1, x2, y2);
      }
      if (action === "writing") return;
    }
    setAction("none");
    setSelectedElement(null);
  };
  const handleBlur = (e) => {
    const { id, x1, y1 } = selectedElement;
    const text = e.target.value;

    if (!text) {
      console.log("no text");
      setAction("none");
      setSelectedElement(null);
      return;
    }
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, text);
  };
  const onZoom = (e) => {
    setScale((state) => Math.min(Math.max(state + e, 0.1), 20));
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const img = document.getElementById("img");

      if (files.length === 0) return;
      if (files[0].type.split("/")[0] !== "image") return;
      const imageUrl = URL.createObjectURL(files[0]);
      img.src = imageUrl;
      setAction("addingImage");
      setTool("image");
      setImageUrl(imageUrl);
    }
  };

  console.log("toll", tool);
  const ChangeSize = () => {
    if (textSize === 34) return 5;
    if (textSize === 30) return 4;
    if (textSize === 24) return 3;
    if (textSize === 20) return 2;
    if (textSize === 14) return 2;
    if (textSize === 10) return 1;
  };
  return (
    <div>
      <img
        src=""
        alt=""
        className="hidden pointer-events-none outline-none"
        id="img"
      />
      <section className=" fixed bottom-2 left-1/2 -translate-x-1/2 z-50 bg-transparent">
        <div className="overflow-hidden flex gap-4 p-4 text-white z-50 w-full bg-black border-gray-500 border-[1px] h-14 rounded-2xl">
          <div className="flex gap-1 items-center">
            <button onClick={() => onZoom(-0.1)}>-</button>
            <span onClick={() => setScale(1)}>
              {new Intl.NumberFormat("en-GB", { style: "percent" }).format(
                scale
              )}
            </span>
            <button onClick={() => onZoom(+0.1)}>+</button>
          </div>
          <div className="flex gap-1 items-center ">
            <Select tool={tool} setTool={setTool} />
            <Line tool={tool} setTool={setTool} />
            <Pencil tool={tool} setTool={setTool} />
            <Eraser tool={tool} setTool={setTool} />
            <Shape tool={tool} setTool={setTool} />
            <Text tool={tool} setTool={setTool} />
            <ImageBar setTool={setTool} />
            <input
              type="file"
              className="hidden"
              id="inputFile"
              onChange={onFileSelect}
            />
          </div>
        </div>
        <LineOptions
          tool={tool}
          colorLine={colorLine}
          setColorLine={setColorLine}
          setLineWidth={setLineWidth}
        />
        <PencilOptions
          tool={tool}
          colorPencil={colorPencil}
          setColorPencil={setColorPencil}
          setPencilWidth={setPencilWidth}
        />
        <ShapeOptions
          setTool={setTool}
          tool={tool}
          colorShape={colorShape}
          setColorShape={setColorShape}
          setFillStyle={setFillStyle}
          fillStyle={fillStyle}
        />
        <TextOptions
          tool={tool}
          colorText={colorText}
          setColorText={setColorText}
          setTextSize={setTextSize}
          textSize={textSize}
        />
      </section>
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            color: `${selectedElement ? selectedElement.color : colorText}`,
            position: "fixed",
            top:
              (selectedElement.y1 - ChangeSize()) * scale +
              panOffset.y * scale -
              scaleOffset.y,
            left:
              selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x,

            font: `${
              selectedElement ? selectedElement.size * scale : 24 * scale
            }px sans-serif`,
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            zIndex: 2,
          }}
          className="text-white"
        />
      ) : null}
      <canvas
        className="bg-[#141414]"
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "absolute", zIndex: 1 }}
      ></canvas>
    </div>
  );
}

export default App;
