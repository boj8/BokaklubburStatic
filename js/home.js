// JavaScript source code

document.addEventListener('DOMContentLoaded', function() {
    // Load current book
    const currentBook = getMostRecentBook();
    const section = document.getElementById('currentBookSection');
    
    if (currentBook) {
        section.innerHTML = `
            <h2 class="section-title">Við erum að lesa núna</h2>
            <div class="current-book">
                <div class="current-book-cover">
                    <img src="${currentBook.coverPath}" alt="${currentBook.title}" class="book-cover" />
                </div>
                <div class="current-book-details">
                    <h3 class="current-book-title">${currentBook.title}</h3>
                    <p class="current-book-author">${currentBook.author}</p>
                    <p class="current-book-description">${currentBook.description}</p>
                    <p class="current-book-deadline">Frestur til 1. janúar</p>
                    <div class="current-book-actions">
                        <a href="books.html" class="btn-view-books">Sjá allar bækur</a>
                    </div>
                </div>
            </div>
        `;
    }
});
