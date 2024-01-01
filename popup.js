const form = document.querySelector('form');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const link = document.querySelector('input[name="link"]');
    const linkValue = link.value;
    const anchor = document.createElement('a');
    anchor.href = linkValue;
    anchor.textContent = document.querySelector('input[name="website"]').value; 
    const blacklisted = document.querySelector('.links');
    blacklisted.appendChild(anchor);
})