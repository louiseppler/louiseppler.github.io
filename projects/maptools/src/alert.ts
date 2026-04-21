export async function showAlert(title: string, options: string[]): Promise<string> {
    console.log("Showing Alert");
    
    const popup = document.getElementById("alert")!

    // clear existing content
    popup.innerHTML = '';

    // title
    const h3 = document.createElement('h3');
    h3.textContent = title;
    popup.appendChild(h3);

    return new Promise((resolve) => {
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = option;
            btn.className = 'btn btn-outline-secondary btn-sm mb-1';

            btn.addEventListener('click', () => {
                popup.style.display = 'none';
                resolve(option);
            });

            popup.appendChild(btn);
            popup.appendChild(document.createElement('br'));
        });

        // show popup
        popup.style.display = 'block';
    });
}

export function showSnackbar(text: string) {
    const div = document.getElementById("snackbar")!
    div.style.display = 'block'

    div.innerHTML = text;
}

export function hideSnackbar() {
    const div = document.getElementById("snackbar")!
    div.style.display = 'none'
}