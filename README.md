# build up porfolio
Portfolio website

## Features
-about, contact, home, faq sections
- Filter portfolio projects by category using JavaScript
- Responsive layout for mobile and desktop
- Clean, modern portfolio presentation
- Containerized with Docker + Nginx
- runs in docker
## How to Run Locally
Open `index.html` in your browser.

## How to Run with Docker
1. Build the image:
   `docker build -t buildupporfolio .`
2. Run the container:
   `docker run -p 8080:80 buildupporfolio`
3. Open: `http://localhost:8080`

## Tech Stack
HTML5, CSS3, Vanilla JavaScript, Docker, Nginx