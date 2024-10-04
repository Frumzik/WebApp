

const blocks = document.querySelectorAll('.block');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

blocks.forEach(block => {
    block.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    });
});



window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});
