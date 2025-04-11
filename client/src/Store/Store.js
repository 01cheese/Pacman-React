import Headers from "../Main/Headers";
import "./Store.css";

const Store = () => {
    return (
        <>
            <Headers />
            <div className="systemInfo">
                <div className="cardStore">
                    <div className="headStore">Store // your balance 190.322 points</div>
                    <div className="contentStore">
                        <p style={{ fontSize: "72px", color: "#2d8cf0" }}>
                            Coming soon!
                        </p>
                        <div className="cardsGrid">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={index} className="cardElement">
                                    Item {index + 1}
                                    <button className="buttonStore">Buy</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Store;
