export function loadUiElements(
    colorModeChanged: (value: string) => void,
    undoCallback: () => void,
    redoCallback: () => void
): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".segment button");
    buttons.forEach(btn => {
        
        btn.onclick = () => {
            buttons.forEach(b => b.classList.remove("active"));

            btn.classList.add("active");
            if (btn.dataset.value) {
                colorModeChanged(btn.dataset.value);
            }
        };
    });

    document.getElementById("undo-button")!.onclick = () => {undoCallback();};
    document.getElementById("redo-button")!.onclick = () => {redoCallback();};

}

