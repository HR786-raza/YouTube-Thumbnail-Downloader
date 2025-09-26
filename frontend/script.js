async function getThumbnail() {
    const url = document.getElementById("youtubeURL").value;
    const videoID = extractVideoID(url);
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = "";

    if (!videoID) {
        errorDiv.textContent = "Invalid YouTube URL";
        return;
    }

    const sizes = [
        { label: "Small", name: "default", resolution: "120x90" },
        { label: "Medium", name: "mqdefault", resolution: "320x180" },
        { label: "Small (Clear)", name: "hqdefault", resolution: "480x360" },
        { label: "Medium (Clearer)", name: "sddefault", resolution: "640x480" },
        { label: "HD", name: "maxresdefault", resolution: "1280x720" }
    ];

    let html = "";
    for (const size of sizes) {
        const endpoint = `http://localhost:3000/thumbnail?url=${encodeURIComponent(url)}&quality=${size.name}`;
        const imgURL = `https://img.youtube.com/vi/${videoID}/${size.name}.jpg`;
        try {
            await fetch(endpoint).then(r => {
                if (!r.ok) throw new Error();
            });
            html += `
                        <div>
                            <h3>${size.label} (${size.resolution})</h3>
                            <a href="${imgURL}" target="_blank">
                                <img src="${imgURL}" alt="${size.label} Thumbnail" style="max-width: 100%; height: auto;">
                            </a>
                            <br>
                            <a href="${endpoint}" class="download">Download ${size.label}</a>
                        </div>
                    `;
        } catch (err) {
            html += `<div><h3>${size.label} (${size.resolution})</h3><p class='error'>Error fetching ${size.label} thumbnail.</p></div>`;
        }
    }

    document.getElementById("thumbnail").innerHTML = html;
}

function extractVideoID(url) {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}