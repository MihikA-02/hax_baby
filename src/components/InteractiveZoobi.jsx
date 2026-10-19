
import { useState } from "react";
import base from "../assets/base_zoobi.png";
import pupils from "../assets/zoobi_eyes.png";

export default function InteractiveZoobi() {
    const [look, setLook] = useState({ x: 0, y: 0 });

    function handlePointerMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        setLook({
            x: x * 7,
            y: y * 6,
        });
    }

    function resetLook() {
        setLook({ x: 0, y: 0 });
    }

    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={resetLook}
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "none",
                margin: "0 auto",
            }}
        >
            <img
                src={base}
                alt="Zoobi"
                draggable={false}
                style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                }}
            />

            <img
                src={pupils}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{
                    position: "absolute",
                    left: "36%",
                    top: "49.6%",
                    width: "34%",
                    height: "68",
                    transform: `translate(${look.x}px, ${look.y}px)`,
                    transition: "transform 80ms ease-out",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
