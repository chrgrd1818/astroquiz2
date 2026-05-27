// Main client-side JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Initialize any client-side functionality here
  console.log('Astro SSR App loaded');

  // Example: Form validation
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required]');
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add('border-red-500');
          isValid = false;
        } else {
          input.classList.remove('border-red-500');
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });

    // Real-time validation feedback
    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('blur', () => {
        if (!input.value.trim() && input.required) {
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });
    });
  });

  // Smooth page transitions
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      // Allow default navigation behavior
      // Astro handles prefetching automatically
    });
  });
});

// Utility function to show notifications
export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500'
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Utility function for API calls with error handling
export async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}