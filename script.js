document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openCameraBtn = document.getElementById('open-camera');
    const cameraPlaceholder = document.getElementById('camera-placeholder');
    const cameraView = document.getElementById('camera-view');
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('capture-photo');
    const photoPreview = document.getElementById('photo-preview');
    const capturedImage = document.getElementById('captured-image');
    const retakeBtn = document.getElementById('retake-photo');
    const analyzeBtn = document.getElementById('analyze-photo');
    const analyzingIndicator = document.getElementById('analyzing-indicator');
    const resultsSection = document.getElementById('results-section');
    const canvas = document.getElementById('canvas');
    
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Camera stream
    let stream = null;
    
    // Open camera
    openCameraBtn.addEventListener('click', async function() {
        try {
            const constraints = {
                video: {
                    facingMode: isMobile ? 'environment' : 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            video.srcObject = stream;
            cameraPlaceholder.classList.add('hidden');
            cameraView.classList.remove('hidden');
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access the camera. Please make sure you\'ve granted permission.');
        }
    });
    
    // Capture photo
    captureBtn.addEventListener('click', function() {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame on the canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        capturedImage.src = imageDataUrl;
        
        // Stop the camera stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Show photo preview
        cameraView.classList.add('hidden');
        photoPreview.classList.remove('hidden');
    });
    
    // Retake photo
    retakeBtn.addEventListener('click', async function() {
        photoPreview.classList.add('hidden');
        
        // Restart camera
        try {
            const constraints = {
                video: {
                    facingMode: isMobile ? 'environment' : 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            video.srcObject = stream;
            cameraView.classList.remove('hidden');
        } catch (err) {
            console.error('Error accessing camera:', err);
            cameraPlaceholder.classList.remove('hidden');
        }
    });
    
    // Analyze photo
    analyzeBtn.addEventListener('click', function() {
        photoPreview.classList.add('hidden');
        analyzingIndicator.classList.remove('hidden');
        
        // Simulate API call to analyze the image
        setTimeout(function() {
            // Mock results - in a real app, this would come from an API
            const mockResults = {
                foodItems: ["Grilled Chicken Breast", "Brown Rice", "Steamed Broccoli"],
                nutritionalInfo: {
                    calories: 420,
                    protein: 35,
                    carbs: 45,
                    fat: 10,
                    fiber: 8,
                    sugar: 2
                },
                macroPercentages: {
                    protein: 33,
                    carbs: 43,
                    fat: 24
                },
                healthScore: 85,
                recommendations: [
                    "Good balance of protein and complex carbohydrates",
                    "Consider adding some healthy fats like avocado or olive oil"
                ]
            };
            
            // Display results
            displayResults(mockResults);
            
            // Hide analyzing indicator
            analyzingIndicator.classList.add('hidden');
            
            // Show results
            resultsSection.classList.remove('hidden');
        }, 3000);
    });
    
    // Display results
    function displayResults(results) {
        const { foodItems, nutritionalInfo, macroPercentages, healthScore, recommendations } = results;
        
        // Create results HTML
        let resultsHTML = `
            <div class="card nutrition-card">
                <div class="card-header">
                    <h2 class="card-title">Meal Analysis Results</h2>
                </div>
                <div class="card-content">
                    <div class="section">
                        <h3 class="section-title">Detected Food Items</h3>
                        <div class="food-items">
                            ${foodItems.map(item => `<span class="badge">${item}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="health-score-header">
                            <h3 class="section-title">Health Score</h3>
                            <span class="health-score ${getHealthScoreClass(healthScore)}">${healthScore}/100</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${healthScore}%"></div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Nutritional Information</h3>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <div class="nutrition-label">Calories</div>
                                <div class="nutrition-value">${nutritionalInfo.calories} kcal</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-label">Protein</div>
                                <div class="nutrition-value">${nutritionalInfo.protein}g</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-label">Carbohydrates</div>
                                <div class="nutrition-value">${nutritionalInfo.carbs}g</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-label">Fat</div>
                                <div class="nutrition-value">${nutritionalInfo.fat}g</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-label">Fiber</div>
                                <div class="nutrition-value">${nutritionalInfo.fiber}g</div>
                            </div>
                            <div class="nutrition-item">
                                <div class="nutrition-label">Sugar</div>
                                <div class="nutrition-value">${nutritionalInfo.sugar}g</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Macro Breakdown</h3>
                        <div class="macro-chart-container">
                            <canvas id="results-macro-chart" width="200" height="200"></canvas>
                            <div class="macro-legend">
                                <div class="legend-item">
                                    <div class="color-dot protein"></div>
                                    <span>Protein: ${macroPercentages.protein}%</span>
                                </div>
                                <div class="legend-item">
                                    <div class="color-dot carbs"></div>
                                    <span>Carbs: ${macroPercentages.carbs}%</span>
                                </div>
                                <div class="legend-item">
                                    <div class="color-dot fat"></div>
                                    <span>Fat: ${macroPercentages.fat}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="macro-bars">
                            <div class="macro-bar-item">
                                <div class="macro-bar-header">
                                    <span>Protein</span>
                                    <span>${macroPercentages.protein}%</span>
                                </div>
                                <div class="progress-bar protein-bg">
                                    <div class="progress-fill protein" style="width: ${macroPercentages.protein}%"></div>
                                </div>
                            </div>
                            <div class="macro-bar-item">
                                <div class="macro-bar-header">
                                    <span>Carbohydrates</span>
                                    <span>${macroPercentages.carbs}%</span>
                                </div>
                                <div class="progress-bar carbs-bg">
                                    <div class="progress-fill carbs" style="width: ${macroPercentages.carbs}%"></div>
                                </div>
                            </div>
                            <div class="macro-bar-item">
                                <div class="macro-bar-header">
                                    <span>Fat</span>
                                    <span>${macroPercentages.fat}%</span>
                                </div>
                                <div class="progress-bar fat-bg">
                                    <div class="progress-fill fat" style="width: ${macroPercentages.fat}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3 class="section-title">Recommendations</h3>
                        <ul class="recommendations">
                            ${recommendations.map(recommendation => `
                                <li class="recommendation">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <span>${recommendation}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="try-button-container">
                <button id="analyze-another" class="button primary">Analyze Another Meal</button>
            </div>
        `;
        
        // Set results HTML
        resultsSection.innerHTML = resultsHTML;
        
        // Draw macro chart
        drawMacroChart('results-macro-chart', macroPercentages.protein, macroPercentages.carbs, macroPercentages.fat);
        
        // Add event listener to analyze another button
        document.getElementById('analyze-another').addEventListener('click', function() {
            resultsSection.classList.add('hidden');
            cameraPlaceholder.classList.remove('hidden');
        });
    }
    
    // Get health score class
    function getHealthScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 45) return 'avarage';
        return 'poor';
    }
    
    // Draw macro chart
    function drawMacroChart(canvasId, protein, carbs, fat) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        
        // Calculate angles
        const total = protein + carbs + fat;
        const proteinAngle = (protein / total) * 2 * Math.PI;
        const carbsAngle = (carbs / total) * 2 * Math.PI;
        const fatAngle = (fat / total) * 2 * Math.PI;
        
        // Define colors
        const colors = {
            protein: '#3b82f6', // blue
            carbs: '#22c55e',   // green
            fat: '#eab308'      // yellow
        };
        
        // Draw pie chart
        const size = 200;
        let startAngle = 0;
        
        // Draw protein segment
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 2);
        ctx.arc(size / 2, size / 2, size / 2 - 10, startAngle, startAngle + proteinAngle);
        ctx.fillStyle = colors.protein;
        ctx.fill();
        startAngle += proteinAngle;
        
        // Draw carbs segment
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 2);
        ctx.arc(size / 2, size / 2, size / 2 - 10, startAngle, startAngle + carbsAngle);
        ctx.fillStyle = colors.carbs;
        ctx.fill();
        startAngle += carbsAngle;
        
        // Draw fat segment
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 2);
        ctx.arc(size / 2, size / 2, size / 2 - 10, startAngle, startAngle + fatAngle);
        ctx.fillStyle = colors.fat;
        ctx.fill();
        
        // Draw center circle (donut hole)
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Add label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('Macros', size / 2, size / 2);
    }
    
    // Initialize the FAQ functionality
    initializeFaqToggle();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation classes to elements when they enter viewport
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Initial check
    checkIfInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Mobile menu toggle (if exists)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
});

// Additional NutriSnap specific functionality
function analyzeImage(imageUrl) {
    // This would connect to your backend API in a real app
    console.log('Analyzing image:', imageUrl);
    
    // Simulate loading state
    const analysisResult = document.querySelector('.nutrition-analysis');
    if (analysisResult) {
        analysisResult.classList.add('loading');
        
        // Simulate API call delay
        setTimeout(() => {
            analysisResult.classList.remove('loading');
            analysisResult.classList.add('loaded');
        }, 2000);
    }
}

// Track nutrition goals (placeholder)
function updateGoalProgress(goalId, progress) {
    const progressBar = document.querySelector(`#${goalId} .progress-bar`);
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Initialize health metrics charts if they exist
function initializeCharts() {
    const chartContainers = document.querySelectorAll('.nutrition-chart');
    
    if (chartContainers.length > 0) {
        console.log('Initializing nutrition charts');
        // This would integrate with a charting library in a real app
    }
}

// Initialize page-specific functionality
function initializePageSpecific() {
    const currentPage = document.body.id;
    
    switch(currentPage) {
        case 'home-page':
            // Home page specific code
            break;
        case 'profile-page':
            initializeCharts();
            break;
        case 'analyze-page':
            // Setup image upload functionality
            const uploadButton = document.querySelector('.upload-button');
            if (uploadButton) {
                uploadButton.addEventListener('click', () => {
                    document.querySelector('.file-input').click();
                });
            }
            break;
    }
}

// Call when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePageSpecific);

// FAQ Toggle Functionality
function initializeFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        // Set the first FAQ item as active by default
        faqItems[0].classList.add('active');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // If this item is already active and being clicked again, just close it
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    return;
                }
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle the current item with a slight delay for better animation
                setTimeout(() => {
                    item.classList.add('active');
                }, 50);
            });
        });
    }
}