document.addEventListener('DOMContentLoaded', function() {
    const tabContent = document.querySelector('.tab-content');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    function updateTabContentHeight() {
        const activePane = document.querySelector('.tab-pane.active');
        if (activePane) {
            tabContent.style.height = `${activePane.offsetHeight}px`;
        }
    }
    updateTabContentHeight();

    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', updateTabContentHeight);
    });

    window.addEventListener('resize', updateTabContentHeight);
});