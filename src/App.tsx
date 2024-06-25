import { useEffect, useState } from "react";
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
function App() {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("line");
  const [selectedElement, setSelectedElement] = useState();

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    //const roughCanvas = rough.canvas(canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.strokeRect(10, 10, 100, 100);
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(500, 500);
    // ctx.stroke();
    elements.forEach((e) => createElement(e));
  }, [elements]);
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

  const positionWithinElement = (clientX, clientY, element) => {
    const { type, x1, y1, x2, y2 } = element;
    //x1=323 x2=401 y1=133 y2=174
    //x1 - x2 = 78 = 6084  y1 - y2 = 41 = 1681

    if (type === "rectangle") {
      // const minX = Math.min(x1, x2);
      // const maxX = Math.max(x1, x2);
      // const minY = Math.min(y1, y2);
      // const maxY = Math.max(y1, y2);
      const topLeft = nearPoint(clientX, clientY, x1, y1, "tl");
      const topRight = nearPoint(clientX, clientY, x2, y1, "tr");
      const bottonLeft = nearPoint(clientX, clientY, x1, y2, "bl");
      const bottonRight = nearPoint(clientX, clientY, x2, y2, "br");
      const inside =
        clientX >= x1 && clientX <= x2 && clientY >= y1 && clientY <= y2
          ? "inside"
          : null;
      return topLeft || topRight || bottonLeft || bottonRight || inside;
    } else {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x: clientX, y: clientY };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      const start = nearPoint(clientX, clientY, x1, y1, "start");
      const end = nearPoint(clientX, clientY, x2, y2, "end");
      const inside = Math.abs(offset) < 1 ? "inside" : null;
      return start || end || inside;
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

      default:
        break;
    }
  };
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;

        setSelectedElement({ ...element, offsetX, offsetY });
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

      setSelectedElement(newElement);
      setElements((state) => [...state, newElement]);
      setAction("drawning");
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
    const { clientX, clientY } = e;
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
      const { id, x1, y1, x2, y2, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const nextX1 = clientX - offsetX;
      const nextY1 = clientY - offsetY;

      updateElement(id, nextX1, nextY1, nextX1 + width, nextY1 + height);
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
  const updateElement = (id, x1, y1, x2, y2) => {
    const copyElements = [...elements];
    const elementForUpdate = copyElements.find((e) => e.id === id);
    const index = copyElements.findIndex((e) => e.id === id);

    const newElement = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      type: elementForUpdate.type,
      id: id,
    };

    copyElements[index] = newElement;

    setElements(copyElements, true);
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      if (action === "drawning" || action === "resizing") {
        const id = selectedElement.id;
        const currentElement = elements.find((e) => e.id === id);

        const { x1, y1, x2, y2 } = adjustElementCoordinates(currentElement);
        if (tool !== "pencil") updateElement(id, x1, y1, x2, y2);
      }
    }
    setAction("none");
    setSelectedElement(null);
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
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
      {/* {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.y1 - 2 + panOffset.y,
            left: selectedElement.x1 + panOffset.x,
            font: "24px sans-serif",
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
      ) : null} */}
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
