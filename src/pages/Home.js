import React, { useState, useEffect, useRef } from "react";
import "./Home.scss";

const Home = () => {
  const cursorRef = useRef();
  const rectangleRef = useRef();

  const [startPoint, _setStartPoint] = useState({ x: -1, y: -1 });
  const startPointRef = useRef({ x: -1, y: -1 });
  const setStartPoint = (value) => {
    startPointRef.current = value;
    _setStartPoint(value);
  };
  const [endPoint, _setEndPoint] = useState({ x: -1, y: -1 });
  const endPointRef = useRef({ x: -1, y: -1 });
  const setEndPoint = (value) => {
    endPointRef.current = value;
    _setEndPoint(value);
  };
  const [randomPoints, _setRandomPoints] = useState([]);
  const randomPointsRef = useRef([]);
  const setRandomPoints = (value) => {
    if (typeof value === "function") {
      value = value(randomPointsRef.current);
    }
    randomPointsRef.current = value;
    _setRandomPoints(value);
  };
  const [dragged, _setDragged] = useState([]);
  const draggedRef = useRef([]);
  const setDragged = (value) => {
    console.log(value);
    if (typeof value === "function") {
      value = value(draggedRef.current);
    }
    draggedRef.current = value;
    _setDragged(value);
  };

  useEffect(() => {
    const randomPoints = Array(Math.ceil((1 - Math.random()) * 50 + 10))
      .fill(0)
      .map((item) => {
        return {
          h: Math.random() * 360,
          s: Math.random(),
          l: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: Math.random() * 20 + 5,
          height: Math.random() * 20 + 5,
        };
      });
    setRandomPoints(randomPoints);
    setDragged(Array(randomPoints.length).fill(false));
    setInterval(() => {
      const randomPoints = Array(Math.ceil((1 - Math.random()) * 50 + 10))
        .fill(0)
        .map((item) => {
          return {
            h: Math.random() * 360,
            s: Math.random(),
            l: Math.random(),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            width: Math.random() * 20 + 5,
            height: Math.random() * 20 + 5,
          };
        });
      setRandomPoints(randomPoints);
      setDragged(Array(randomPoints.length).fill(false));
    }, 10000);
  }, []);

  useEffect(() => {
    const homeDiv = document.getElementsByClassName("home")[0];
    const moveFunction = (e) => {
      cursorRef.current.style.display = "block";
      cursorRef.current.style.left = `${e.pageX}px`;
      cursorRef.current.style.top = `${e.pageY}px`;
      if (startPointRef.current.x >= 0 && startPointRef.current.y >= 0) {
        setEndPoint({ x: e.pageX, y: e.pageY });
        rectangleRef.current.style.opacity = 0.4;
        setDragged(
          Array(randomPointsRef.current.length)
            .fill(0)
            .map((item, index) => {
              const point = randomPointsRef.current[index];
              console.log(
                point.x,
                startPointRef.current.x,
                endPointRef.current.x
              );
              if (
                (point.x * 0.8 + window.innerWidth * 0.1 - 25 + point.width / 2 - startPointRef.current.x) *
                  (point.x * 0.8 + window.innerWidth * 0.1 - 25 + point.width / 2 - endPointRef.current.x) <
                0
              ) {
                if (
                  (point.y * 0.8 + window.innerHeight * 0.1 - 25 + point.height / 2 - startPointRef.current.y) *
                    (point.y * 0.8 + window.innerHeight * 0.1 - 25 + point.height / 2 - endPointRef.current.y) <
                  0
                ) {
                  return true;
                }
              }
              return false;
            })
        );
      }
    };
    const downFunction = (e) => {
      setStartPoint({ x: e.pageX, y: e.pageY });
      setEndPoint({ x: e.pageX, y: e.pageY });
      rectangleRef.current.style.display = "block";
      setDragged(Array(randomPointsRef.current.length).fill(false));
    };
    const leaveFunction = (e) => {
      cursorRef.current.style.display = "none";
    };
    const upFunction = (e) => {
      rectangleRef.current.style.opacity = 1;
      setTimeout(() => {
        setStartPoint({ x: -1, y: -1 });
        setEndPoint({ x: -1, y: -1 });
        rectangleRef.current.style.display = "none";
      }, 0);
    };
    window.addEventListener("mousemove", moveFunction);
    homeDiv.addEventListener("mouseleave", leaveFunction);
    window.addEventListener("mousedown", downFunction);
    window.addEventListener("mouseup", upFunction);

    return () => {
      window.removeEventListener("mousemove", moveFunction);
      homeDiv.removeEventListener("mouseleave", leaveFunction);
      window.removeEventListener("mousedown", downFunction);
      window.removeEventListener("mouseup", upFunction);
    };
  }, []);

  useEffect(() => {
    const [minX, maxX] =
      startPoint.x > endPoint.x
        ? [endPoint.x, startPoint.x]
        : [startPoint.x, endPoint.x];
    const [minY, maxY] =
      startPoint.y > endPoint.y
        ? [endPoint.y, startPoint.y]
        : [startPoint.y, endPoint.y];
    rectangleRef.current.style.left = `${minX}px`;
    rectangleRef.current.style.top = `${minY}px`;
    rectangleRef.current.style.width = `${maxX - minX}px`;
    rectangleRef.current.style.height = `${maxY - minY}px`;
  }, [startPoint.x, startPoint.y, endPoint.x, endPoint.y]);

  return (
    <div className="home">
      <div ref={cursorRef} className="cursor" />
      <div ref={rectangleRef} className="rectangle" />
      {randomPoints.map((item, index) => (
        <div
          className="random-item"
          key={index}
          style={{
            backgroundColor: `hsl(${item.h}, ${item.s * 100}%, ${
              item.l * 100
            }%)`,
            opacity: dragged[index] ? 1 : 0.5,
            boxShadow: dragged[index]
              ? `0 0 0 10px rgba(255, 255, 255, 0.5)`
              : "unset",
            width: `${item.width}px`,
            height: `${item.height}px`,
            left: `${item.x * 0.8 + window.innerWidth * 0.1 - 25}px`,
            top: `${item.y * 0.8 + window.innerHeight * 0.1 - 25}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Home;
