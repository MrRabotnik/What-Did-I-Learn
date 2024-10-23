import React from "react";
import "./MathLabContainer.scss";

const items = Array.from({ length: 21 }, (_, i) => i);

const MathLabContainer = () => {
    return (
        <div className="container-bg">
            {items.map((i) => (
                <div
                    key={i}
                    className="item"
                    style={{ "--i": i } as React.CSSProperties}
                ></div>
            ))}
        </div>
    );
};

export default MathLabContainer;
