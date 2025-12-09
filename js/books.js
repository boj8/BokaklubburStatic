document.addEventListener('DOMContentLoaded', function () {
    // Load recent book
    const mostRecentBook = getMostRecentBook();
    const recentSection = document.getElementById('recentBookSection');

    if (mostRecentBook) {
        recentSection.innerHTML = `
            <div class="recent-book">
                <h2>Í lestri núna</h2>
                <div class="recent-book-content">
                    <div class="recent-book-cover">
                        <img src="${mostRecentBook.coverPath}" alt="${mostRecentBook.title}" class="book-cover-large" />
                    </div>
                    <div class="recent-book-details">
                        <h3 class="recent-book-title">${mostRecentBook.title}</h3>
                        <h4 class="recent-book-author">${mostRecentBook.author}</h4>
                        <p class="recent-book-description">${mostRecentBook.description}</p>
                        <p class="recent-book-deadline">Frestur til 1. janúar</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Load previous books
    const previousBooks = getPreviousBooks();
    const booksGrid = document.getElementById('booksGrid');

    previousBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverPath}" alt="${book.title}" class="book-cover-img" />
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-description" data-full-text="${book.description}">${book.description}</p>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });

    // Add click handlers for expandable descriptions
    const descriptions = document.querySelectorAll('.book-description');
    descriptions.forEach(desc => {
        // Check if text is actually truncated
        if (desc.scrollHeight > desc.clientHeight) {
            desc.classList.add('truncated');
            desc.style.cursor = 'pointer';
            
            desc.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        }
    });
});