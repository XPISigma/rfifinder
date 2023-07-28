// Pixabay API key
const apiKey = '38506732-469281f9af5a63a30fce251a5';

// DOM elements
const searchButton = document.getElementById('search-button');
const searchQueryInput = document.getElementById('search-query');
const imageContainer = document.getElementById('image-container');
const appContainer = document.getElementById('app-container');
const loader = document.getElementById('loader');

let currentPage = 1;
let currentQuery = '';

// Fetch images from Pixabay API
async function fetchImages(query, page) {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// Display images in the container
function displayImages(images) {
  images.forEach(image => {
    const imgElement = document.createElement('img');
    imgElement.src = image.webformatURL;
    imgElement.alt = image.tags;
    imgElement.addEventListener('click', () => downloadImage(image.webformatURL));
    imgElement.addEventListener('mouseover', () => imgElement.classList.add('hovered'));
    imgElement.addEventListener('mouseout', () => imgElement.classList.remove('hovered'));
    imageContainer.appendChild(imgElement);
  });
}

// Download the image
function downloadImage(imageURL) {
  const link = document.createElement('a');
  link.href = imageURL;
  link.download = 'image.png'; // You can change the download filename and format if needed
  link.target = '_blank';
  link.click();
  showDownloadMessage();
}

// Show "Image Downloaded" message temporarily
function showDownloadMessage() {
  const downloadMessage = document.createElement('div');
  downloadMessage.classList.add('download-message');
  downloadMessage.textContent = 'Image Downloaded';
  document.body.appendChild(downloadMessage);
  setTimeout(() => {
    document.body.removeChild(downloadMessage);
  }, 1000); // 1 second
}

// Scroll event handler for infinite scroll
function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    fetchAndDisplayMoreImages(currentQuery, currentPage + 1);
  }
}

// Fetch and display more images
async function fetchAndDisplayMoreImages(query, page) {
  loader.style.display = 'block';
  const images = await fetchImages(query, page);
  if (images.length > 0) {
    displayImages(images);
    currentPage = page;
  }
  loader.style.display = 'none';
}

// Search button click event
searchButton.addEventListener('click', async () => {
  const searchQuery = searchQueryInput.value;
  if (searchQuery) {
    currentQuery = searchQuery;
    currentPage = 1;
    imageContainer.innerHTML = ''; // Clear previous search results
    const images = await fetchImages(searchQuery, currentPage);
    displayImages(images);
    // Enable infinite scroll when a search is performed
    window.addEventListener('scroll', handleScroll);
  }
});

// Disable infinite scroll on search bar focus
searchQueryInput.addEventListener('focus', () => {
  window.removeEventListener('scroll', handleScroll);
});

// Enable infinite scroll again when search bar loses focus
searchQueryInput.addEventListener('blur', () => {
  window.addEventListener('scroll', handleScroll);
});

// Initial loading of images (infinite scroll)
fetchAndDisplayMoreImages(currentQuery, currentPage);

// Infinite scroll event listener (for initial loading and subsequent scrolling)
window.addEventListener('scroll', handleScroll);
