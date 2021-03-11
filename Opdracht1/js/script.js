const figures = document.querySelectorAll('figure');
window.addEventListener('load', ()=>{
    figures.forEach(figure =>{ 
        figure.classList.add('hidden')
    ;});
    figures[0].classList.remove('hidden');
});

for (let index = 0; index < figures.length; index++) {
    const figure = figures[index];
    figure.addEventListener('click', () => {
        if (index <= 1) {
            figures[index + 1].classList.remove('hidden');}
    });
}