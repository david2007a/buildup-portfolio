/* ========================================
   JAVASCRIPT FILE - Portfolio Form & Image Handler
   This file adds interactivity to the webpage:
   - Form validation and submission handling
   - Data storage in browser's localStorage
   - Image loading and management
   ======================================== */

/* ========================================
   PAGE LOAD EVENT - Runs when HTML fully loads
   ======================================== */

// DOMContentLoaded fires when all HTML is loaded (but images may still be loading)
document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements we'll use later
    // getElementById finds element by its 'id' attribute
    const form = document.getElementById('portfolioForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const portfolioImage = document.getElementById('portfolioImage');
    const imagePlaceholder = document.querySelector('.image-placeholder');

    // Set up image functionality
    initializeImageHandler();

    /* ======================================
       FORM SUBMISSION HANDLER
       Runs when user clicks the "Proceed" button
       ====================================== */
    form.addEventListener('submit', function(e) {
        // e.preventDefault() stops the form from sending data to a server
        // We want to handle it locally instead
        e.preventDefault();

        // .trim() removes whitespace from beginning and end of text
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        // Check if name and email are valid
        // If validation fails, stop processing
        if (!validateForm(name, email)) {
            return;  // Exit function early
        }

        // If valid, save the form data
        processFormData(name, email);

        // Clear the form inputs for next submission
        form.reset();
    });

    /* ======================================
       REAL-TIME VALIDATION
       Checks input when user leaves field (blur event)
       ====================================== */

    // Validate name when user clicks away from name field
    nameInput.addEventListener('blur', function() {
        validateName(this.value.trim());
    });

    // Validate email when user clicks away from email field
    emailInput.addEventListener('blur', function() {
        validateEmail(this.value.trim());
    });

    /* ======================================
       CLEAR ERROR STATE ON FOCUS
       When user clicks in field again, remove error styling
       ====================================== */

    nameInput.addEventListener('focus', function() {
        // Remove 'error' CSS class which turns border red
        this.classList.remove('error');
    });

    emailInput.addEventListener('focus', function() {
        this.classList.remove('error');
    });
});

/* ========================================
   VALIDATION FUNCTIONS
   These check if form inputs are valid
   ======================================== */

// Main validation function - checks both name and email
function validateForm(name, email) {
    // Assume form is valid until proven otherwise
    let isValid = true;

    // If name validation fails, mark form as invalid
    if (!validateName(name)) {
        isValid = false;
    }

    // If email validation fails, mark form as invalid
    if (!validateEmail(email)) {
        isValid = false;
    }

    // Return true only if both are valid
    return isValid;
}

// Validate name input
function validateName(name) {
    const nameInput = document.getElementById('name');
    
    // Check 1: Is name empty?
    if (name === '') {
        showError(nameInput, 'Name is required');
        return false;  // Validation failed
    }

    // Check 2: Is name long enough?
    // .length returns number of characters
    if (name.length < 2) {
        showError(nameInput, 'Name must be at least 2 characters');
        return false;
    }

    // Check 3: Does name contain only allowed characters?
    // This uses a regular expression (regex) pattern:
    // ^[a-zA-Z\s'-]+$ means:
    //   ^ = start of string
    //   [a-zA-Z\s'-]+ = letters (a-z, A-Z), spaces (\s), hyphens, apostrophes
    //   $ = end of string
    //   .test() returns true if pattern matches
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
        showError(nameInput, 'Name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
    }

    // If all checks pass, clear any error message
    clearError(nameInput);
    return true;  // Validation succeeded
}

// Validate email input
function validateEmail(email) {
    const emailInput = document.getElementById('email');
    
    // Email regex pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // This checks for basic email format: something@something.something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check 1: Is email empty?
    if (email === '') {
        showError(emailInput, 'Email is required');
        return false;
    }

    // Check 2: Does email match the pattern?
    if (!emailRegex.test(email)) {
        showError(emailInput, 'Please enter a valid email address');
        return false;
    }

    // If all checks pass
    clearError(emailInput);
    return true;
}

/* ========================================
   ERROR & SUCCESS DISPLAY FUNCTIONS
   Show feedback to user
   ======================================== */

// Show error message below input field
function showError(input, message) {
    // Add 'error' class which turns input red (in CSS)
    input.classList.add('error');
    
    // Find and remove any existing error message
    // querySelector finds first matching element
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();  // Delete from DOM (page)
    }

    // Create new error message element
    // document.createElement makes a new HTML element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';  // Assign CSS class for styling
    errorDiv.textContent = message;  // Set the error text
    
    // Add error message to page right after the input
    input.parentElement.appendChild(errorDiv);
}

// Remove error state from input
function clearError(input) {
    // Remove red styling
    input.classList.remove('error');
    
    // Find and remove error message if it exists
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/* ========================================
   DATA STORAGE FUNCTIONS
   Save form data to browser's localStorage
   ======================================== */

// Process and store form data
function processFormData(name, email) {
    // Create object to store all user data
    // Objects are like containers for related data
    const userData = {
        name: name,                           // User's name
        email: email,                         // User's email
        timestamp: new Date().toLocaleString()  // Current date/time
    };

    // Log to browser console (F12 to open) - useful for debugging
    console.log('Form Data Submitted:', userData);

    // Get existing data from localStorage
    // localStorage is like a small database in the browser
    // getItem retrieves data, JSON.parse converts text back to object
    // || [] means "if nothing exists, use empty array"
    const existingData = JSON.parse(localStorage.getItem('portfolioVisitors')) || [];
    
    // Add new user data to the array
    existingData.push(userData);
    
    // Save updated array back to localStorage
    // JSON.stringify converts object to text for storage
    localStorage.setItem('portfolioVisitors', JSON.stringify(existingData));

    // Show success message to user
    showSuccessMessage(name);
}

// Display success message after form submission
function showSuccessMessage(name) {
    const form = document.getElementById('portfolioForm');
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    
    // Use backticks (`) for template literals - allows ${variable} substitution
    successDiv.innerHTML = `<strong>Welcome, ${name}!</strong><br>Thank you for your interest. We'll be in touch soon.`;
    
    // Insert success message before the form
    form.parentElement.insertBefore(successDiv, form);

    // Temporarily hide form
    form.style.display = 'none';

    // setTimeout runs code after specified milliseconds (3000 ms = 3 seconds)
    setTimeout(() => {
        // Show form again
        form.style.display = 'block';
        // Remove success message
        successDiv.remove();
    }, 3000);
}

/* ========================================
   ADMIN UTILITY FUNCTIONS
   Access and manage stored data
   ======================================== */

// Get all stored visitor data
// Call in browser console: getStoredVisitors()
function getStoredVisitors() {
    // Parse JSON text into object, or return empty array if nothing
    return JSON.parse(localStorage.getItem('portfolioVisitors')) || [];
}

// Delete all stored visitor data
// Call in browser console: clearStoredVisitors()
function clearStoredVisitors() {
    // Remove the item from localStorage
    localStorage.removeItem('portfolioVisitors');
    console.log('Stored visitor data has been cleared');
}

// Display all stored visitors in table format
// Call in browser console: displayStoredVisitors()
function displayStoredVisitors() {
    const visitors = getStoredVisitors();
    // console.table() displays data in a readable table
    console.table(visitors);
}

/* ========================================
   IMAGE HANDLER FUNCTIONS
   Manage image loading and manipulation
   ======================================== */

// Set up image handling when page loads
function initializeImageHandler() {
    const portfolioImage = document.getElementById('portfolioImage');
    const imagePlaceholder = document.querySelector('.image-placeholder');
    const imageContainer = document.querySelector('.image-container');

    // Check if user previously saved an image URL
    const savedImageUrl = localStorage.getItem('portfolioImageUrl');
    if (savedImageUrl) {
        // Load the saved image
        loadImage(savedImageUrl);
    }

    // Set up right-click (context menu) on image container
    imageContainer.addEventListener('contextmenu', function(e) {
        // e.preventDefault() stops the default browser context menu
        e.preventDefault();
        // Show our custom menu instead
        showImageMenu();
    });

    // What happens when image successfully loads
    portfolioImage.addEventListener('load', function() {
        // Add 'loaded' class to show the image and hide placeholder
        this.classList.add('loaded');
        // Hide placeholder text
        imagePlaceholder.classList.add('hidden');
        console.log('Image loaded successfully');
    });

    // What happens if image fails to load
    portfolioImage.addEventListener('error', function() {
        // Remove 'loaded' class to hide image
        this.classList.remove('loaded');
        // Show placeholder instead
        imagePlaceholder.classList.remove('hidden');
        console.error('Failed to load image');
    });
}

// Load image from URL and save it
function loadImage(imageUrl) {
    const portfolioImage = document.getElementById('portfolioImage');
    // Set the image src to display it
    portfolioImage.src = imageUrl;
    // Save URL to localStorage so it persists
    localStorage.setItem('portfolioImageUrl', imageUrl);
}

// Let user enter image URL via prompt dialog
function setImageFromUrl() {
    // prompt() shows dialog for user to type
    const imageUrl = prompt('Enter image URL:', '');
    
    // Check if user entered something (not canceled/empty)
    if (imageUrl && imageUrl.trim() !== '') {
        // Load the image from that URL
        loadImage(imageUrl.trim());
    }
}

// Let user upload image from their computer
function setImageFromFile() {
    // Create hidden file input element
    const input = document.createElement('input');
    input.type = 'file';        // File chooser dialog
    input.accept = 'image/*';   // Only allow image files
    
    // This runs when user selects a file
    input.onchange = function(e) {
        // e.target.files[0] is the selected file
        const file = e.target.files[0];
        
        if (file) {
            // FileReader lets us read the file
            const reader = new FileReader();
            
            // When file is done reading
            reader.onload = function(event) {
                // event.target.result is the file as a data URL (base64 encoded image)
                loadImage(event.target.result);
            };
            
            // readAsDataURL converts file to data URL (text representation of image)
            reader.readAsDataURL(file);
        }
    };
    
    // Click the hidden input to open file dialog
    input.click();
}

// Remove current image
function clearImage() {
    const portfolioImage = document.getElementById('portfolioImage');
    const imagePlaceholder = document.querySelector('.image-placeholder');
    
    // Empty the image src
    portfolioImage.src = '';
    // Hide the image
    portfolioImage.classList.remove('loaded');
    // Show placeholder
    imagePlaceholder.classList.remove('hidden');
    // Delete saved URL
    localStorage.removeItem('portfolioImageUrl');
}

// Show right-click context menu
function showImageMenu() {
    // Create menu element
    const menu = document.createElement('div');
    menu.className = 'image-context-menu';
    
    // Add three buttons using innerHTML (as HTML string)
    menu.innerHTML = `
        <button onclick="setImageFromUrl()">Add Image from URL</button>
        <button onclick="setImageFromFile()">Upload Image File</button>
        <button onclick="clearImage()">Clear Image</button>
    `;
    
    // Add menu to page
    document.body.appendChild(menu);
    
    // Auto-remove menu after 3 seconds so it doesn't stay visible forever
    setTimeout(() => menu.remove(), 3000);
}
