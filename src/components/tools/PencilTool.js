import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Image as KonvaImage } from 'react-konva';
import eraserCursor from '../../assets/images/eraser-cursor.png';
import pencilCursor from '../../assets/images/pencil-cursor.png';


const Pencil = ({ imageSrc, width, height }) => {
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeTool, setActiveTool] = useState('pencil');
    const stageRef = useRef(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = () => {
            setImage(img);
        };
    }, [imageSrc]);

    const handleMouseDown = (e) => {
        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        setIsDrawing(true);

        if (activeTool === 'pencil') {
            setLines([...lines, { points: [pos.x, pos.y] }]);
        } else if (activeTool === 'erase') {
            eraseLine(pos);
        }
    };

    const handleMouseMove = (e) => {
        if (activeTool === 'pencil' && isDrawing) {
            const stage = stageRef.current;
            const point = stage.getPointerPosition();
            const lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([point.x, point.y]);

            setLines([...lines.slice(0, lines.length - 1), lastLine]);
        } else if (activeTool === 'erase' && isDrawing) {
            const stage = stageRef.current;
            const pos = stage.getPointerPosition();
            eraseLine(pos);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const eraseLine = (pos) => {
        const newLines = lines.filter((line) => {
            const points = line.points;
            for (let i = 0; i < points.length; i += 2) {
                const pointX = points[i];
                const pointY = points[i + 1];
                if (
                    pos.x >= pointX - 10 && pos.x <= pointX + 10 &&
                    pos.y >= pointY - 10 && pos.y <= pointY + 10
                ) {
                    return false;
                }
            }
            return true;
        });
        setLines(newLines);
    };

    const handleToolChange = (tool) => {
        setActiveTool(tool);
    };

    const cursorStyle = () => {
        if (activeTool === 'erase') {
            return `url(${eraserCursor}), auto`;
        } else if (activeTool === 'pencil') {
            return `url(${pencilCursor}), auto`;
        } else {
            return 'default';
        }
    }

    return (

        <div>
            <button onClick={() => handleToolChange('pencil')}>Рисовать</button>
            <button onClick={() => handleToolChange('erase')}>Стерка</button>

            <Stage
                width={width}
                height={height}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                style={{ cursor: cursorStyle() }}
            >
                <Layer>
                    {image && (
                        <KonvaImage
                            image={image}
                            width={width}
                            height={height}
                            x={0}
                            y={0}
                        />
                    )}
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#112981"
                            strokeWidth={2}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default Pencil;
