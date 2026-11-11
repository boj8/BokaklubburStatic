document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('nominateForm');
    const memberSelect = document.getElementById('member');
    const bookInput = document.getElementById('bookSearch');
    const resultsEl = document.getElementById('searchResults');
    const selectedEl = document.getElementById('selectedBook');
    const statusEl = document.getElementById('status');
    const submitButton = document.getElementById('submitButton');

    let selectedBook = null;
    let searchResults = [];
    let searchTimer = null;
    let searchCounter = 0;

    populateMemberSelect(memberSelect);

    // Returns true when every member has nominated
    async function allHaveNominated() {
        const nominations = (await votingRequest('/nominations')) || [];
        const nominated = new Set(nominations.map(n => n.memberName.toLowerCase()));
        return VOTING_MEMBERS.every(m => nominated.has(m.toLowerCase()));
    }

    function closeNominations() {
        form.style.display = 'none';
        if (!document.getElementById('closedNotice')) {
            form.insertAdjacentHTML('afterend', `
                <div id="closedNotice" class="apply-validation-summary">
                    Tilnefningum er lokið. Allir meðlimir hafa tilnefnt bók.
                </div>
            `);
        }
    }

    // Nominating is closed once everyone has nominated; fail closed if the check fails
    try {
        if (await allHaveNominated()) {
            closeNominations();
            return;
        }
    } catch (error) {
        form.style.display = 'none';
        showStatus(statusEl, error.message, true);
        return;
    }

    bookInput.addEventListener('input', function () {
        selectedBook = null;
        selectedEl.innerHTML = '';
        clearTimeout(searchTimer);

        const query = bookInput.value.trim();
        if (query.length < 3) {
            resultsEl.innerHTML = '';
            return;
        }
        searchTimer = setTimeout(() => searchBooks(query), 400);
    });

    resultsEl.addEventListener('click', function (e) {
        const button = e.target.closest('button[data-index]');
        if (!button) {
            return;
        }
        selectBook(searchResults[Number(button.dataset.index)]);
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideStatus(statusEl);

        const memberName = memberSelect.value;
        const book = selectedBook ? selectedBook.value : bookInput.value.trim();

        if (!memberName) {
            showStatus(statusEl, 'Veldu nafnið þitt.', true);
            return;
        }
        if (!book) {
            showStatus(statusEl, 'Skrifaðu nafn bókar.', true);
            return;
        }

        submitButton.disabled = true;
        try {
            const data = await postJson('/nominate', { memberName: memberName, book: book });
            showStatus(statusEl, `${data.message || 'Tilnefning vistuð.'} (${book})`, false);

            try {
                if (await allHaveNominated()) {
                    closeNominations();
                }
            } catch (checkError) {
                // Ignore; the page will check again on the next load
            }
        } catch (error) {
            showStatus(statusEl, error.message, true);
        } finally {
            submitButton.disabled = false;
        }
    });

    async function searchBooks(query) {
        const requestId = ++searchCounter;
        resultsEl.innerHTML = '<p class="vote-hint">Leita...</p>';

        try {
            const url = 'https://openlibrary.org/search.json?limit=6' +
                '&fields=key,title,author_name,first_publish_year,cover_i' +
                `&q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            if (requestId !== searchCounter) {
                return; // A newer search has started
            }

            searchResults = (data.docs || []).map(doc => {
                const author = doc.author_name ? doc.author_name[0] : '';
                return {
                    title: doc.title,
                    author: author,
                    year: doc.first_publish_year || '',
                    coverId: doc.cover_i || null,
                    value: author ? `${doc.title} – ${author}` : doc.title
                };
            });
            renderResults();
        } catch (error) {
            if (requestId === searchCounter) {
                resultsEl.innerHTML = '<p class="vote-hint">Leit tókst ekki. Þú getur skrifað nafn bókarinnar og sent það inn.</p>';
            }
        }
    }

    function renderResults() {
        if (searchResults.length === 0) {
            resultsEl.innerHTML = '<p class="vote-hint">Engar bækur fundust. Þú getur skrifað nafn bókarinnar og sent það inn.</p>';
            return;
        }
        resultsEl.innerHTML = searchResults.map((book, index) => `
            <button type="button" class="book-result" data-index="${index}">
                ${book.coverId
                ? `<img src="https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg" alt="" />`
                : '<span class="book-result-placeholder"></span>'}
                <span class="book-result-text">
                    <strong>${escapeHtml(book.title)}</strong><br />
                    <small>${escapeHtml(book.author)}${book.year ? ` (${book.year})` : ''}</small>
                </span>
            </button>
        `).join('');
    }

    function selectBook(book) {
        selectedBook = book;
        bookInput.value = book.title;
        resultsEl.innerHTML = '';
        selectedEl.innerHTML = `
            <div class="selected-book">
                ${book.coverId
                ? `<img src="https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg" alt="${escapeHtml(book.title)}" />`
                : ''}
                <div>
                    <strong>${escapeHtml(book.title)}</strong><br />
                    ${escapeHtml(book.author)}${book.year ? `<br /><small>Fyrst gefin út ${book.year}</small>` : ''}
                </div>
            </div>
        `;
    }
});