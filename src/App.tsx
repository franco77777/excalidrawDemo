import { useEffect, useLayoutEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import getStroke from "perfect-freehand";
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
  const [imageSize, setImageSize] = useState();

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

    switch (element.type) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
        break;
      case "rectangle":
        ctx.beginPath();
        ctx.strokeRect(
          element.x1,
          element.y1,
          element.x2 - element.x1,
          element.y2 - element.y1
        );
        break;
      case "pencil":
        {
          const stroke = getSvgPathFromStroke(
            getStroke(element.points, {
              size: 5,
            })
          );
          ctx.fill(new Path2D(stroke));
        }

        break;
      case "text":
        {
          ctx.beginPath();
          ctx.textBaseline = "top";
          ctx.font = "24px sans-serif";
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
      case "rectangle":
      case "line": {
        const newElement = {
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
      case "line":
        {
          newElement = {
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
          ctx.font = "24px sans-serif";
          const textWidth = ctx.measureText(text).width;
          //const textHeight = ctx.measureText('M').width;
          const textHeight = 24;
          newElement = {
            x1,
            y1,
            x2: x1 + textWidth,
            y2: y1 + textHeight,
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

    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, text);
  };
  const onZoom = (e) => {
    setScale((state) => Math.min(Math.max(state + e, 0.1), 20));
  };
  const openInputFile = (e) => {
    e.preventDefault();
    const input = document.getElementById("inputFile");
    setTool("image");
    input.click();
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

  return (
    <div>
      <img
        src=""
        alt=""
        className="hidden pointer-events-none outline-none"
        id="img"
      />
      <section className="overflow-hidden p-4 text-white z-50 fixed bottom-2 left-1/2 -translate-x-1/2 flex gap-4 bg-black h-14 rounded-2xl">
        <div className="flex gap-1 items-center">
          <button onClick={() => onZoom(-0.1)}>-</button>
          <span onClick={() => setScale(1)}>
            {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
          </span>
          <button onClick={() => onZoom(+0.1)}>+</button>
        </div>
        <div className="flex gap-1 items-center">
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
        <div className="flex gap-1 items-center ">
          <div
            onClick={() => setTool("selection")}
            className={`${
              tool === "selection" ? "text-blue-500" : ""
            } cursor-pointer`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M14.7333 20.7491C13.2101 20.7188 11.7085 20.3814 10.318 19.757L4.87829 17.1973C4.34611 16.9441 3.93572 16.4896 3.73708 15.9334C3.53844 15.3772 3.56776 14.7647 3.81861 14.2301C4.0693 13.697 4.52083 13.2855 5.07393 13.0862C5.62702 12.8869 6.2364 12.916 6.76806 13.1673L7.78359 13.6455C7.30673 12.0247 6.35302 9.34093 4.92245 7.7732L4.03938 7.05577C3.61069 6.70638 3.33352 6.20406 3.26602 5.65417C3.19852 5.10429 3.34593 4.54956 3.67732 4.1063C4.01168 3.66165 4.50487 3.3643 5.05324 3.27676C5.60161 3.18922 6.16247 3.3183 6.61794 3.63687C7.68536 4.4013 8.62184 5.33461 9.39078 6.40032C9.65039 6.01099 10.0282 5.71593 10.4681 5.55889C10.7401 5.45759 11.0297 5.41243 11.3196 5.42613C11.6094 5.43983 11.8935 5.51209 12.1548 5.6386C12.3904 5.74876 12.6054 5.89855 12.7906 6.08146C13.0286 5.81011 13.3329 5.60559 13.6737 5.48803C13.9277 5.39526 14.1977 5.35453 14.4676 5.36822C14.7376 5.38191 15.0021 5.44975 15.2455 5.56774C15.5246 5.6943 15.7698 5.88556 15.9608 6.12575C16.0596 6.06152 16.1665 6.01088 16.2787 5.97518C16.6663 5.83573 17.0933 5.85626 17.4658 6.0323C17.8384 6.20833 18.126 6.52546 18.2656 6.91405L20.3762 12.7953C20.8746 14.2018 20.8746 15.7376 20.3762 17.1442C20.1126 17.8897 19.6865 18.5667 19.1289 19.126C18.5713 19.6853 17.8962 20.1127 17.153 20.3771C16.373 20.6365 15.555 20.7623 14.7333 20.7491ZM5.93087 14.3364C5.80289 14.3092 5.61036 14.3014 5.51411 14.3364C5.40235 14.3749 5.29944 14.4355 5.21147 14.5146C5.12349 14.5937 5.05223 14.6898 5.00192 14.797C4.95016 14.9037 4.92031 15.0197 4.91412 15.1382C4.90793 15.2567 4.92553 15.3752 4.96589 15.4867C5.00625 15.5983 5.06854 15.7005 5.14906 15.7874C5.22958 15.8744 5.32669 15.9442 5.43463 15.9927L10.839 18.6056C10.839 18.6056 14.0357 20.0936 16.6673 19.1459C17.2293 18.9564 17.7408 18.6409 18.1632 18.2235C18.5855 17.8061 18.9074 17.2976 19.1045 16.7367C19.5014 15.6227 19.5014 14.4053 19.1045 13.2913L16.9852 7.41005C16.9763 7.38088 16.9615 7.35386 16.9418 7.33069C16.922 7.30751 16.8977 7.28868 16.8703 7.27537C16.843 7.26207 16.8131 7.25458 16.7828 7.25337C16.7524 7.25216 16.7221 7.25725 16.6938 7.26833C16.6381 7.29017 16.5931 7.33292 16.5684 7.38751C16.5436 7.44209 16.5411 7.50419 16.5613 7.56062L16.8615 8.44635C16.8967 8.53035 16.9142 8.62071 16.913 8.71179C16.9118 8.80288 16.892 8.89274 16.8547 8.97581C16.8175 9.05888 16.7635 9.13337 16.6964 9.19466C16.6292 9.25595 16.5501 9.30272 16.4642 9.33207C16.3804 9.36729 16.2903 9.38486 16.1995 9.38368C16.1087 9.38251 16.0191 9.36261 15.9363 9.32523C15.8535 9.28785 15.7792 9.23378 15.7181 9.16639C15.657 9.099 15.6104 9.01973 15.5811 8.9335L14.9983 7.30377C14.9265 7.12321 14.7915 6.97517 14.6185 6.88748C14.5305 6.8502 14.4359 6.831 14.3404 6.831C14.2448 6.831 14.1502 6.8502 14.0622 6.88748C13.8857 6.94651 13.7386 7.07145 13.6514 7.23637C13.5643 7.40129 13.5438 7.59353 13.5942 7.7732L13.8414 8.70321C13.8851 8.86876 13.8624 9.04485 13.7782 9.19382C13.694 9.3428 13.5551 9.45282 13.3911 9.50036C13.2294 9.55136 13.0543 9.53738 12.9028 9.46137C12.7512 9.38535 12.635 9.25324 12.5787 9.09292L11.9958 7.48091C11.9143 7.26388 11.7512 7.08756 11.5415 6.98985C11.3318 6.89214 11.0923 6.88083 10.8743 6.95834C10.658 7.04009 10.4822 7.20369 10.3848 7.41402C10.2873 7.62435 10.276 7.86461 10.3533 8.08319L10.7772 9.27008C10.8123 9.35408 10.8298 9.44443 10.8287 9.53551C10.8275 9.6266 10.8076 9.71646 10.7704 9.79953C10.7331 9.8826 10.6792 9.95709 10.612 10.0184C10.5448 10.0797 10.4658 10.1264 10.3798 10.1558C10.2961 10.191 10.206 10.2086 10.1152 10.2074C10.0244 10.2062 9.93476 10.1863 9.85194 10.1489C9.76912 10.1116 9.69485 10.0575 9.63374 9.99012C9.57264 9.92273 9.52601 9.84345 9.49675 9.75721C8.77492 7.80197 7.47469 6.11463 5.7702 4.92117C5.60002 4.79896 5.38865 4.74903 5.18198 4.78219C4.97531 4.81536 4.79003 4.92895 4.66636 5.09831C4.5387 5.26644 4.54989 5.42432 4.5746 5.63419C4.59932 5.84407 4.70436 6.0361 4.86755 6.16977L5.75062 6.91377L5.81244 6.97577C8.22322 9.57094 9.34471 14.6373 9.38886 14.8499C9.41539 14.9719 9.40709 15.0989 9.36492 15.2164C9.32275 15.3339 9.24841 15.4371 9.15044 15.5142C9.05374 15.5891 8.93848 15.6361 8.8171 15.6501C8.69571 15.6642 8.57281 15.6447 8.46164 15.5939L6.92105 14.797C6.5371 14.5875 6.45627 14.5146 5.93087 14.3364Z"
              ></path>
            </svg>
          </div>
          <div
            className={`${
              tool === "line" ? "text-blue-500" : ""
            } cursor-pointer`}
            onClick={() => setTool("line")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.25 6.5C14.25 4.70507 15.7051 3.25 17.5 3.25C19.2949 3.25 20.75 4.70507 20.75 6.5C20.75 8.29493 19.2949 9.75 17.5 9.75C16.89 9.75 16.3193 9.58196 15.8316 9.28964L9.28964 15.8316C9.58196 16.3193 9.75 16.89 9.75 17.5C9.75 19.2949 8.29493 20.75 6.5 20.75C4.70507 20.75 3.25 19.2949 3.25 17.5C3.25 15.7051 4.70507 14.25 6.5 14.25C7.14146 14.25 7.73952 14.4358 8.24327 14.7566L14.7566 8.24327C14.4358 7.73952 14.25 7.14146 14.25 6.5ZM17.5 4.75C16.5335 4.75 15.75 5.5335 15.75 6.5C15.75 7.4665 16.5335 8.25 17.5 8.25C18.4665 8.25 19.25 7.4665 19.25 6.5C19.25 5.5335 18.4665 4.75 17.5 4.75ZM6.5 15.75C5.5335 15.75 4.75 16.5335 4.75 17.5C4.75 18.4665 5.5335 19.25 6.5 19.25C7.4665 19.25 8.25 18.4665 8.25 17.5C8.25 16.5335 7.4665 15.75 6.5 15.75Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div
            onClick={() => setTool("pencil")}
            className={`${
              tool === "pencil" ? "mt-0 text-blue-500" : "mt-6"
            } duration-300 ease-in-out cursor-pointer hover:mt-0 `}
          >
            <svg
              width="36"
              height="61"
              viewBox="0 0 36 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              id="edgeless-pen-icon"
            >
              <g filter="url(#filter0_d_8344_17221)">
                <path
                  d="M8.00024 40.8966L12.283 39.469V108.538H8.00024V40.8966Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8.00024 40.8966L12.283 39.469V108.538H8.00024V40.8966Z"
                  fill="white"
                  fill-opacity="0.1"
                ></path>
                <path
                  d="M12.283 38.9929H17.5174V108.538H12.283V38.9929Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M17.5175 38.9929H22.7519V108.538H17.5175V38.9929Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M17.5175 38.9929H22.7519V108.538H17.5175V38.9929Z"
                  fill="black"
                  fill-opacity="0.1"
                ></path>
                <path
                  d="M22.752 32.9448L27.0347 40.8965V108.538H22.752V32.9448Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M22.752 32.9448L27.0347 40.8965V108.538H22.752V32.9448Z"
                  fill="black"
                  fill-opacity="0.2"
                ></path>
                <path
                  d="M16.5909 4.88078C16.8233 3.90625 18.2099 3.90623 18.4423 4.88075L19.896 10.9741L22.2755 20.9483L27.0345 40.8965L23.9871 40.0231C23.1982 39.7969 22.3511 39.9039 21.6431 40.3189L18.023 42.4414C17.7107 42.6245 17.3238 42.6245 17.0115 42.4414L13.0218 40.1023C12.5499 39.8256 11.9851 39.7543 11.4592 39.905L8 40.8965L12.7583 20.9483L15.1374 10.9741L16.5909 4.88078Z"
                  fill="#F1F1F1"
                ></path>
                <path
                  d="M16.5909 4.88078C16.8233 3.90625 18.2099 3.90623 18.4423 4.88075L19.896 10.9741L22.2755 20.9483L27.0345 40.8965L23.9871 40.0231C23.1982 39.7969 22.3511 39.9039 21.6431 40.3189L18.023 42.4414C17.7107 42.6245 17.3238 42.6245 17.0115 42.4414L13.0218 40.1023C12.5499 39.8256 11.9851 39.7543 11.4592 39.905L8 40.8965L12.7583 20.9483L15.1374 10.9741L16.5909 4.88078Z"
                  fill="url(#paint0_linear_8344_17221)"
                  fill-opacity="0.1"
                ></path>
                <g filter="url(#filter1_b_8344_17221)">
                  <path
                    d="M16.5915 4.88076C16.824 3.90624 18.2106 3.90625 18.443 4.88077L20.3725 12.969H14.6621L16.5915 4.88076Z"
                    fill="currentColor"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_d_8344_17221"
                  x="0"
                  y="-3"
                  width="35.0347"
                  height="123.538"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="4"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_8344_17221"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_8344_17221"
                    result="shape"
                  ></feBlend>
                </filter>
                <filter
                  id="filter1_b_8344_17221"
                  x="12.7587"
                  y="2.24645"
                  width="9.51722"
                  height="12.626"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feGaussianBlur
                    in="BackgroundImageFix"
                    stdDeviation="0.951724"
                  ></feGaussianBlur>
                  <feComposite
                    in2="SourceAlpha"
                    operator="in"
                    result="effect1_backgroundBlur_8344_17221"
                  ></feComposite>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_backgroundBlur_8344_17221"
                    result="shape"
                  ></feBlend>
                </filter>
                <linearGradient
                  id="paint0_linear_8344_17221"
                  x1="22.1949"
                  y1="21.2552"
                  x2="16.9439"
                  y2="22.5016"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop></stop>
                  <stop offset="0.302413" stop-opacity="0"></stop>
                  <stop offset="0.557292" stop-opacity="0"></stop>
                  <stop offset="1" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div
            onClick={() => setTool("eraser")}
            className={`${
              tool === "eraser" ? "mt-0 text-blue-500" : "mt-6 text-white"
            } duration-300 ease-in-out cursor-pointer hover:mt-0 `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="72"
              viewBox="0 0 54 52"
              fill="none"
              id="edgeless-eraser-icon"
            >
              <g filter="url(#filter0_d_8344_9244)">
                <rect
                  x="10.575"
                  y="4.575"
                  width="33.35"
                  height="57.5"
                  rx="5.175"
                  fill="#F1F1F1"
                  stroke="#DDDDDD"
                  stroke-width="1.15"
                ></rect>
                <g filter="url(#filter1_f_8344_9244)">
                  <rect
                    x="42.2"
                    y="7.45001"
                    width="18.4"
                    height="3.45"
                    rx="1.725"
                    transform="rotate(90 42.2 7.45001)"
                    fill="white"
                  ></rect>
                </g>
                <g filter="url(#filter2_f_8344_9244)">
                  <rect
                    width="32.2"
                    height="5.75"
                    transform="matrix(1 0 0 -1 11.15 25.85)"
                    fill="#AFAFAF"
                  ></rect>
                </g>
                <path
                  d="M21.5 18.375H22.075V18.95V62.65V63.225H21.5H10H9.425V62.65V40.8V29.875V24.4125V23.0013C9.425 21.9592 10.1672 21.0649 11.1915 20.8728C11.5816 20.7997 11.8933 20.506 11.9896 20.121L12.0015 20.0733L12.5593 20.2128L12.0015 20.0733C12.251 19.0752 13.1478 18.375 14.1767 18.375H15.75H21.5Z"
                  fill="#173654"
                ></path>
                <path
                  d="M21.5 18.375H22.075V18.95V62.65V63.225H21.5H10H9.425V62.65V40.8V29.875V24.4125V23.0013C9.425 21.9592 10.1672 21.0649 11.1915 20.8728C11.5816 20.7997 11.8933 20.506 11.9896 20.121L12.0015 20.0733L12.5593 20.2128L12.0015 20.0733C12.251 19.0752 13.1478 18.375 14.1767 18.375H15.75H21.5Z"
                  fill="url(#paint0_linear_8344_9244)"
                  fill-opacity="0.2"
                ></path>
                <path
                  d="M21.5 18.375H22.075V18.95V62.65V63.225H21.5H10H9.425V62.65V40.8V29.875V24.4125V23.0013C9.425 21.9592 10.1672 21.0649 11.1915 20.8728C11.5816 20.7997 11.8933 20.506 11.9896 20.121L12.0015 20.0733L12.5593 20.2128L12.0015 20.0733C12.251 19.0752 13.1478 18.375 14.1767 18.375H15.75H21.5Z"
                  stroke="#E0E0E0"
                  stroke-width="1.15"
                ></path>
                <path
                  d="M33 18.375H32.425V18.95V62.65V63.225H33H44.5H45.075V62.65V40.8V29.875V24.4125V23.0013C45.075 21.9592 44.3328 21.0649 43.3085 20.8728C42.9184 20.7997 42.6067 20.506 42.5104 20.121L42.4985 20.0733L41.9407 20.2128L42.4985 20.0733C42.249 19.0752 41.3522 18.375 40.3233 18.375H38.75H33Z"
                  fill="#1E96EB"
                ></path>
                <path
                  d="M33 18.375H32.425V18.95V62.65V63.225H33H44.5H45.075V62.65V40.8V29.875V24.4125V23.0013C45.075 21.9592 44.3328 21.0649 43.3085 20.8728C42.9184 20.7997 42.6067 20.506 42.5104 20.121L42.4985 20.0733L41.9407 20.2128L42.4985 20.0733C42.249 19.0752 41.3522 18.375 40.3233 18.375H38.75H33Z"
                  fill="url(#paint1_linear_8344_9244)"
                  fill-opacity="0.2"
                ></path>
                <path
                  d="M33 18.375H32.425V18.95V62.65V63.225H33H44.5H45.075V62.65V40.8V29.875V24.4125V23.0013C45.075 21.9592 44.3328 21.0649 43.3085 20.8728C42.9184 20.7997 42.6067 20.506 42.5104 20.121L42.4985 20.0733L41.9407 20.2128L42.4985 20.0733C42.249 19.0752 41.3522 18.375 40.3233 18.375H38.75H33Z"
                  stroke="#E0E0E0"
                  stroke-width="1.15"
                ></path>
                <rect
                  x="0.575"
                  y="-0.575"
                  width="12.65"
                  height="44.85"
                  transform="matrix(-1 0 0 1 34.15 18.95)"
                  fill="#EFFAFF"
                ></rect>
                <rect
                  x="0.575"
                  y="-0.575"
                  width="12.65"
                  height="44.85"
                  transform="matrix(-1 0 0 1 34.15 18.95)"
                  fill="url(#paint2_linear_8344_9244)"
                  fill-opacity="0.2"
                ></rect>
                <rect
                  x="0.575"
                  y="-0.575"
                  width="12.65"
                  height="44.85"
                  transform="matrix(-1 0 0 1 34.15 18.95)"
                  stroke="#E0E0E0"
                  stroke-width="1.15"
                ></rect>
              </g>
              <defs>
                <filter
                  id="filter0_d_8344_9244"
                  x="0"
                  y="0"
                  width="54"
                  height="75.8"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="4"></feGaussianBlur>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_8344_9244"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_8344_9244"
                    result="shape"
                  ></feBlend>
                </filter>
                <filter
                  id="filter1_f_8344_9244"
                  x="36.45"
                  y="5.15001"
                  width="8.05001"
                  height="23"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    stdDeviation="1.15"
                    result="effect1_foregroundBlur_8344_9244"
                  ></feGaussianBlur>
                </filter>
                <filter
                  id="filter2_f_8344_9244"
                  x="6.54999"
                  y="15.5"
                  width="41.4"
                  height="14.95"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    stdDeviation="2.3"
                    result="effect1_foregroundBlur_8344_9244"
                  ></feGaussianBlur>
                </filter>
                <linearGradient
                  id="paint0_linear_8344_9244"
                  x1="15.75"
                  y1="18.95"
                  x2="15.75"
                  y2="62.65"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-opacity="0"></stop>
                  <stop offset="1"></stop>
                </linearGradient>
                <linearGradient
                  id="paint1_linear_8344_9244"
                  x1="38.75"
                  y1="18.95"
                  x2="38.75"
                  y2="62.65"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="white"></stop>
                  <stop offset="1" stop-opacity="0"></stop>
                </linearGradient>
                <linearGradient
                  id="paint2_linear_8344_9244"
                  x1="5.75"
                  y1="0"
                  x2="5.75"
                  y2="43.7"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#FFF8F8" stop-opacity="0"></stop>
                  <stop offset="1"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <input
            type="radio"
            id="rectangle"
            checked={tool === "rectangle"}
            onChange={() => setTool("rectangle")}
          />
          <label htmlFor="rectangle">Rectangle</label>
          <input
            type="radio"
            id="text"
            checked={tool === "text"}
            onChange={() => setTool("text")}
          />
          <label htmlFor="text">Text</label>
          <input
            type="radio"
            id="image"
            checked={tool === "image"}
            onChange={() => setTool("image")}
          />
          <label htmlFor="text" onClick={openInputFile}>
            Image
          </label>
          <input
            type="file"
            className="hidden"
            id="inputFile"
            onChange={onFileSelect}
          />
        </div>
      </section>

      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top:
              (selectedElement.y1 - 3) * scale +
              panOffset.y * scale -
              scaleOffset.y,
            left:
              selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x,

            font: `${24 * scale}px sans-serif`,
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
      >
        Canvas
      </canvas>
    </div>
  );
}

export default App;
