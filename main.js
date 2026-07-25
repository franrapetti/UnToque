console.log('UnToque landing initialized.');

document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    const dynamicTexts = document.querySelectorAll('.dynamic-text');
    let currentIndex = 0;

    if (preloader && dynamicTexts.length > 0) {
        document.body.style.overflow = 'hidden';

        const switchWord = () => {
            if (currentIndex >= dynamicTexts.length) {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    document.body.style.overflow = '';
                    
                    setTimeout(() => {
                        preloader.remove();
                    }, 800);
                }, 600);
                return;
            }

            const currentWord = dynamicTexts[currentIndex];
            currentWord.classList.add('active');

            setTimeout(() => {
                if (currentIndex < dynamicTexts.length - 1) {
                    currentWord.classList.remove('active');
                    currentWord.classList.add('exit');
                }
                currentIndex++;
                switchWord();
            }, 1200);
        };

        setTimeout(switchWord, 300);
    }

    // Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            accordionItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-body').style.display = 'none';
                i.querySelector('.accordion-icon').textContent = '+';
            });
            
            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.accordion-body').style.display = 'block';
                item.querySelector('.accordion-icon').textContent = '−';
            }
        });
    });
});
