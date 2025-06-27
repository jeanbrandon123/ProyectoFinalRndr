function setupEmailValidation() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    
    if (!emailInput || !emailError) return; 
    
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        
        if (!email.includes('@') || !email.includes('.')) return;
        
        fetch('/registro/verificar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ email: email })
        })
        .then(handleResponse)
        .then(handleValidation)
        .catch(handleError);
    });
    
    function handleResponse(response) {
        if (!response.ok) throw new Error('Error en la respuesta');
        return response.json();
    }
    
    function handleValidation(data) {
        if (data.existe) {
            emailInput.classList.add('is-invalid');
            emailError.style.display = 'block';
            emailError.textContent = 'Este correo ya está registrado';
        } else {
            emailInput.classList.remove('is-invalid');
            emailError.style.display = 'none';
        }
    }
    
    function handleError(error) {
        console.error('Error:', error);
        emailError.textContent = 'Error al verificar el email';
        emailError.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', setupEmailValidation);
