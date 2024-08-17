document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll('img');
    const loadingPercentage = document.getElementById('loading-percentage');
    let imagesLoaded = 0;

    function updateLoadingPercentage() {
        const percentage = Math.floor((imagesLoaded / images.length) * 100);
        loadingPercentage.textContent = `${percentage}%`;
        if (imagesLoaded === images.length) {
            document.body.classList.add('loaded');
        }
    }

    images.forEach((img) => {
        if (img.complete) {
            imagesLoaded++;
            updateLoadingPercentage();
        } else {
            img.addEventListener('load', () => {
                imagesLoaded++;
                updateLoadingPercentage();
            });
        }
    });

    // In case all images were already loaded
    if (imagesLoaded === images.length) {
        document.body.classList.add('loaded');
    }
});
