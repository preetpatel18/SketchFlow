import React, { useEffect, useRef, useState } from 'react';
import { analyzeImage } from "../components/Gemini.js";
import * as fabric from 'fabric';
import img from './SketchFlow.png';

function Home() {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const currentToolRef = useRef('select');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        currentTool: 'select',
        strokeColor: '#000000',
        fillColor: '#000000',
        lineWidth: 2,
        fontFamily: 'Arial',
        fontSize: 20,
        textColor: '#000000',
        eraserWidth: 20
    });

    useEffect(() => {
        currentToolRef.current = settings.currentTool;
    }, [settings.currentTool]);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: false,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true
        });
        fabricCanvasRef.current = canvas;

        const handleMouseDown = (options) => {
            if (!options.pointer) return;
            if (currentToolRef.current === 'square') {
                const rect = new fabric.Rect({
                    left: options.pointer.x,
                    top: options.pointer.y,
                    fill: settings.fillColor,
                    stroke: settings.strokeColor,
                    width: 100,
                    height: 50,
                    strokeWidth: settings.lineWidth,
                    strokeUniform: true
                });
                canvas.add(rect);
                canvas.setActiveObject(rect);
            } else if (currentToolRef.current === 'circle') {
                const circle = new fabric.Circle({
                    radius: 30,
                    fill: settings.fillColor,
                    stroke: settings.strokeColor,
                    left: options.pointer.x,
                    top: options.pointer.y,
                    strokeWidth: settings.lineWidth,
                    strokeUniform: true
                });
                canvas.add(circle);
                canvas.setActiveObject(circle);
            } else if (currentToolRef.current === 'text') {
                const text = new fabric.IText('Click to edit', {
                    left: options.pointer.x,
                    top: options.pointer.y,
                    fontFamily: settings.fontFamily,
                    fontSize: settings.fontSize,
                    fill: settings.textColor,
                    strokeWidth: 0
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                text.enterEditing();
                text.selectAll();
            }
            canvas.renderAll();
        };

        canvas.on('mouse:down', handleMouseDown);
        canvas.on('path:created', (e) => {
            console.log("Path created:", e.path);
        });

        return () => {
            canvas.off('mouse:down', handleMouseDown);
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;
        if (!['pencil', 'eraser'].includes(settings.currentTool)) return;
        canvas.isDrawingMode = true;
        if (settings.currentTool === 'pencil') {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = settings.strokeColor;
            canvas.freeDrawingBrush.width = settings.lineWidth;
        } else if (settings.currentTool === 'eraser') {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = '#ffffff';
            canvas.freeDrawingBrush.width = settings.eraserWidth;
        }
    }, [settings.currentTool, settings.lineWidth, settings.eraserWidth, settings.strokeColor]);

    useEffect(() => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;
        canvas.selection = (settings.currentTool === 'select');
        canvas.isDrawingMode = ['pencil', 'eraser'].includes(settings.currentTool);
    }, [settings.currentTool]);

    useEffect(() => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;
        const activeObject = canvas.getActiveObject();
        if (activeObject && currentToolRef.current === 'select') {
            if (activeObject.type === 'rect' || activeObject.type === 'circle') {
                activeObject.set('stroke', settings.strokeColor);
                canvas.renderAll();
            }
        }
    }, [settings.strokeColor]);

    const handleToolChange = (tool) => {
        console.log("Changing tool to:", tool);
        setSettings(prevSettings => ({ ...prevSettings, currentTool: tool }));
    };

    const handleClearCanvas = () => {
        if (window.confirm('Are you sure you want to clear the canvas?')) {
            const canvas = fabricCanvasRef.current;
            if (canvas) {
                console.log("Clearing canvas...");
                canvas.clear();
                canvas.backgroundColor = '#ffffff';
                canvas.renderAll();
            }
        }
    };

    const handleCanvasSubmit = async () => {
        const canvas = fabricCanvasRef.current;
        const base64Data = canvas.toDataURL("image/png").split(",")[1];
        try {
            setLoading(true);
            const html = await analyzeImage(base64Data);
            const response = await fetch('http://localhost:5050/api/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: html })
            });

            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'react-app.zip';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error:", err);
            alert("Conversion failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "container">       
            <h1>
                <img src={img} alt="SketchFlow" />
            </h1>
            {loading && <p style={{ textAlign: 'center', color: '#3b82f6' }}>Generating React project...</p>}
            <div className="toolBox">
                <div className="toolbar">
                    <button className={settings.currentTool === 'select' ? 'tool active' : 'tool'} onClick={() => handleToolChange('select')}>Select</button>
                    <button className={settings.currentTool === 'square' ? 'tool active t' : 'tool'} onClick={() => handleToolChange('square')}>Square</button>
                    <button className={settings.currentTool === 'circle' ? 'tool active t' : 'tool'} onClick={() => handleToolChange('circle')}>Circle</button>
                    <button className={settings.currentTool === 'pencil' ? 'tool active t' : 'tool'} onClick={() => handleToolChange('pencil')}>Pencil</button>
                    <button className={settings.currentTool === 'eraser' ? 'tool active t' : 'tool'} onClick={() => handleToolChange('eraser')}>Eraser</button>
                    <button className={settings.currentTool === 'text' ? 'tool active t' : 'tool'} onClick={() => handleToolChange('text')}>Text</button>
                    <button className="tool delete-btn" onClick={() => {
                        const canvas = fabricCanvasRef.current;
                        const activeObject = canvas.getActiveObject();
                        if (activeObject) {
                            canvas.remove(activeObject);
                            canvas.discardActiveObject();
                            canvas.renderAll();
                        }
                    }}>🗑️</button>
                </div>
                <div className="controls-group">
                    {settings.currentTool === 'pencil' && (
                        <label className="color-label">Pencil Color:
                            <input class="color-box" type="color" value={settings.strokeColor} onChange={(e) => {
                                const newColor = e.target.value;
                                setSettings({...settings, strokeColor: newColor});
                                if (fabricCanvasRef.current?.freeDrawingBrush) {
                                    fabricCanvasRef.current.freeDrawingBrush.color = newColor;
                                }
                            }} />
                        </label>
                    )}
                    {settings.currentTool !== 'pencil' && (
                        <label className="color-label">Stroke Color:
                            <input class="color-box" type="color" value={settings.strokeColor} onChange={(e) => {
                                const newColor = e.target.value;
                                setSettings({...settings, strokeColor: newColor});
                                const activeObj = fabricCanvasRef.current?.getActiveObject();
                                if (activeObj) {
                                    activeObj.set('stroke', newColor);
                                    fabricCanvasRef.current?.requestRenderAll();
                                }
                            }} />
                        </label>
                    )}
                    <label className="color-label">Fill Color:
                        <input class="color-box" type="color" value={settings.fillColor} onChange={(e) => {
                            const newColor = e.target.value;
                            setSettings({...settings, fillColor: newColor});
                            const activeObj = fabricCanvasRef.current?.getActiveObject();
                            if (activeObj) {
                                activeObj.set('fill', newColor);
                                fabricCanvasRef.current?.requestRenderAll();
                            }
                        }} />
                    </label>
                    {settings.currentTool === 'eraser' && (
                        <label className="color-label">Eraser Width:
                            <input type="number" value={settings.eraserWidth} min="1" max="50" onChange={(e) => {
                                const newWidth = parseInt(e.target.value) || 10;
                                setSettings({...settings, eraserWidth: newWidth});
                                if (fabricCanvasRef.current?.freeDrawingBrush) {
                                    fabricCanvasRef.current.freeDrawingBrush.width = newWidth;
                                }
                            }} />
                        </label>
                    )}
                    {settings.currentTool !== 'eraser' && (
                        <label className="color-label">Line Width:
                            <input type="number" value={settings.lineWidth} min="1" max="20" onChange={(e) => {
                                const newWidth = parseInt(e.target.value) || 1;
                                setSettings({...settings, lineWidth: newWidth});
                                if (settings.currentTool === 'pencil' && fabricCanvasRef.current?.freeDrawingBrush) {
                                    fabricCanvasRef.current.freeDrawingBrush.width = newWidth;
                                } else {
                                    const activeObj = fabricCanvasRef.current?.getActiveObject();
                                    if (activeObj) {
                                        activeObj.set('strokeWidth', newWidth);
                                        fabricCanvasRef.current?.requestRenderAll();
                                    }
                                }
                            }} />
                        </label>
                    )}
                </div>
            </div>
            <canvas ref={canvasRef} id="drawing-canvas" width="800" height="500" />

            <div className="action-buttons">
                <button onClick={handleClearCanvas}>Clear Canvas</button>
                <button onClick={handleCanvasSubmit} disabled={loading}>Convert & Download ZIP</button>
            </div>
        </div>
    );
}

export default Home;