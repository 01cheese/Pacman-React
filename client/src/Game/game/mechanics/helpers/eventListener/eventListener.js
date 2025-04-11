import AudioManager from "../audio/audioManager";
import Timer from "../timer/timer";
import Animator from "../graphics/animator/animator";

export default class EventListener {
    static addDirectionDetection(variables) {
        window.addEventListener(
            "keydown",
            (variables.directionEventListener = ({key}) => {
                if (key === "ArrowUp") {
                    variables.lastKeyPressed = "up";
                } else if (key === "ArrowLeft") {
                    variables.lastKeyPressed = "left";
                } else if (key === "ArrowRight") {
                    variables.lastKeyPressed = "right";
                } else if (key === "ArrowDown") {
                    variables.lastKeyPressed = "down";
                }
            })
        );
    }

    static addVisibilityDetection(variables, assets) {
        window.addEventListener(
            "visibilitychange",
            (variables.visibilityEventListener = () => {
                if (!variables.isGamePaused && variables.isWindowVisible) {
                    variables.isWindowVisible = false;
                    AudioManager.pauseAudio(assets.audioPlayer);
                    Timer.pauseTimers(assets.timers);
                } else if (!variables.isGamePaused && !variables.isWindowVisible) {
                    variables.isWindowVisible = true;
                    AudioManager.resumeAudio(assets.audioPlayer);
                    Timer.resumeTimers(assets.timers);
                }
            })
        );
    }

    static addPauseAndExitDetection(variables, assets, ctx) {
        let qPressed = false;

        window.addEventListener("keydown", (e) => {
            if (e.key === "q" || e.key === "Q") {
                qPressed = true;
            }

            if (e.key === "Escape") {
                // ✅ Prevent multiple modals
                if (qPressed && !variables.isExitModalShown) {
                    variables.isExitModalShown = true;

                    // Pause the game
                    if (!variables.isGamePaused) {
                        variables.isGamePaused = true;
                        cancelAnimationFrame(variables.animationId);
                        AudioManager.pauseAudio(assets.audioPlayer);
                        Timer.pauseTimers(assets.timers);
                        Animator.loadPauseOverlay(ctx, assets.pauseTextImage);
                    }

                    // Show exit confirmation modal
                    const div = document.createElement("div");
                    div.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                ">
                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    ">
                        <h2>Exit Game?</h2>
                        <p>Are you sure you want to quit?</p>
                        <button id="exit-yes">Yes</button>
                        <button id="exit-no">No</button>
                    </div>
                </div>
                `;
                    document.body.appendChild(div);

                    div.querySelector("#exit-yes").onclick = () => {
                        window.location.href = "/";
                    };

                    div.querySelector("#exit-no").onclick = () => {
                        div.remove();
                        variables.isExitModalShown = false;
                    };

                    return;
                }

                // Regular Escape toggle (not Q + Esc)
                if (!qPressed) {
                    if (!variables.isGamePaused) {
                        variables.isGamePaused = true;
                        cancelAnimationFrame(variables.animationId);
                        AudioManager.pauseAudio(assets.audioPlayer);
                        Timer.pauseTimers(assets.timers);
                        Animator.loadPauseOverlay(ctx, assets.pauseTextImage);
                    } else {
                        variables.isGamePaused = false;
                        AudioManager.resumeAudio(assets.audioPlayer);
                        Timer.resumeTimers(assets.timers);
                        Animator.resumeAnimation(variables, ctx, assets);
                    }
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === "q" || e.key === "Q") {
                qPressed = false;
            }
        });
    }


}
