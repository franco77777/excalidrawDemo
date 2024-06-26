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
  const createElement = (element) => {
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
      //console.log("newElement", newElement);

      setSelectedElement(newElement);
      setElements((state) => [...state, newElement]);
      setAction(tool === "text" ? "writing" : "drawning");
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
    const { clientX, clientY } = getMouseCoordinates(e);
    if (action === "panning") {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      return;
    }

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);

      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
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
      case "text":
        {
          const ctx = document.getElementById("canvas").getContext("2d");
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
        if (tool !== "pencil" && tool !== "text")
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
  return (
    <div>
      <div style={{ position: "fixed", zIndex: 2 }}>
        <input
          type="radio"
          id="selection"
          checked={tool === "selection"}
          onChange={() => setTool("selection")}
        />
        <label htmlFor="selection">Selection</label>
        <input
          type="radio"
          id="line"
          checked={tool === "line"}
          onChange={() => setTool("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
        <input
          type="radio"
          id="pencil"
          checked={tool === "pencil"}
          onChange={() => setTool("pencil")}
        />
        <label htmlFor="pencil">Pencil</label>
        <input
          type="radio"
          id="text"
          checked={tool === "text"}
          onChange={() => setTool("text")}
        />
        <label htmlFor="text">Text</label>
      </div>

      <div style={{ position: "fixed", zIndex: 2, bottom: 0, padding: 10 }}>
        <button onClick={() => onZoom(-0.1)}>-</button>
        <span onClick={() => setScale(1)}>
          {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
          {scale}
        </span>
        <button onClick={() => onZoom(+0.1)}>+</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
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
