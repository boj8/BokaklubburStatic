// JavaScript source code

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonSpinner = submitButton.querySelector('.button-spinner');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('validationSummary').style.display = 'none';
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Validate
        let isValid = true;
        if (!name) {
            document.getElementById('nameError').textContent = 'Nafn vantar';
            isValid = false;
        }
        if (!email) {
            document.getElementById('emailError').textContent = 'Netfang vantar';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Netfang verður að vera gilt';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonSpinner.style.display = 'inline';
        
        // Submit to API
        try {
            const apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.apply}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                form.style.display = 'none';
                successMessage.textContent = data.message || 'Umsókn þín hefur verið móttekin. Takk fyrir!';
                successMessage.style.display = 'block';
            } else {
                let errorMessage = 'Villa kom upp. Vinsamlegast reyndu aftur.';
                try {
                    const error = await response.json();
                    if (error.message) {
                        errorMessage = error.message;
                    } else if (error.errors) {
                        // Handle validation errors from API
                        const errors = Object.values(error.errors).flat();
                        errorMessage = errors.join(', ');
                    }
                } catch (e) {
                    // Use default error message
                }
                showValidationSummary(errorMessage);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            showValidationSummary('Villa kom upp. Vinsamlegast reyndu aftur síðar.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonSpinner.style.display = 'none';
        }
    });
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showValidationSummary(message) {
        const summary = document.getElementById('validationSummary');
        summary.textContent = message;
        summary.style.display = 'block';
        summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
