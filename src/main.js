import './login.js';

document.addEventListener('DOMContentLoaded', function() {
    const guestButton = document.querySelector('.guest');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    guestButton.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        overlay.classList.toggle('active');

        if (sidebar.classList.contains('hidden')) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.add('hidden');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});
