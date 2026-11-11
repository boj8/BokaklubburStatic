document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('voteForm');
    const memberSelect = document.getElementById('member');
    const ranksEl = document.getElementById('ranks');
    const galleryEl = document.getElementById('bookGallery');
    const statusEl = document.getElementById('status');
    const submitButton = document.getElementById('submitButton');

    populateMemberSelect(memberSelect);

    let nominations = [];
    try {
        nominations = (await votingRequest('/nominations')) || [];
    } catch (error) {
        form.style.display = 'none';
        galleryEl.style.display = 'none';
        showStatus(statusEl, error.message, true);
        return;
    }

    // Voting opens only when every member has nominated
    const nominatedMembers = new Set(nominations.map(n => n.memberName.toLowerCase()));
    const missingMembers = VOTING_MEMBERS.filter(m => !nominatedMembers.has(m.toLowerCase()));

    if (missingMembers.length > 0) {
        form.style.display = 'none';
        galleryEl.style.display = 'none';
        const nominatedCount = VOTING_MEMBERS.length - missingMembers.length;
        form.insertAdjacentHTML('beforebegin', `
            <div class="apply-validation-summary">
                Atkvæðagreiðsla opnar þegar allir meðlimir hafa tilnefnt bók.
                ${nominatedCount} af ${VOTING_MEMBERS.length} hafa tilnefnt.
                <br />Eftir að tilnefna: ${missingMembers.map(escapeHtml).join(', ')}.
            </div>
        `);
        return;
    }

    const books = [];
    const seen = new Set();
    nominations.forEach(n => {
        const key = n.book.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            books.push(n.book);
        }
    });
    books.sort((a, b) => a.localeCompare(b, 'is'));

    // Gallery of all nominated books
    galleryEl.innerHTML = books.map(b => `
        <div class="gallery-item">
            <img data-cover-for="${escapeHtml(b)}" alt="${escapeHtml(b)}" hidden />
            <span>${escapeHtml(b)}</span>
        </div>
    `).join('');
    applyCovers(galleryEl);

    const rankCount = Math.min(VOTING_MAX_RANKS, books.length);
    for (let i = 1; i <= rankCount; i++) {
        const field = document.createElement('div');
        field.className = 'apply-field';
        field.innerHTML = `
            <label class="apply-label" for="rank${i}">${i}. sæti${i === 1 ? ' (uppáhalds)' : ''}</label>
            <div class="rank-row">
                <select id="rank${i}" class="vote-select rank-select">
                    <option value="">— Veldu bók —</option>
                    ${books.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('')}
                </select>
                <img class="rank-cover" alt="" hidden />
            </div>
        `;
        ranksEl.appendChild(field);
    }

    const selects = Array.from(ranksEl.querySelectorAll('.rank-select'));
    selects.forEach(select => select.addEventListener('change', function () {
        updateDisabledOptions();
        updateRankCover(select);
    }));

    // Prevent choosing the same book twice
    function updateDisabledOptions() {
        const chosen = selects.map(s => s.value).filter(v => v);
        selects.forEach(select => {
            Array.from(select.options).forEach(option => {
                option.disabled = option.value !== '' &&
                    option.value !== select.value &&
                    chosen.includes(option.value);
            });
        });
    }

    function updateRankCover(select) {
        const row = select.closest('.rank-row');
        const img = row.querySelector('.rank-cover');
        img.hidden = true;
        img.removeAttribute('src');
        if (!select.value) {
            delete img.dataset.coverFor;
            return;
        }
        img.dataset.coverFor = select.value;
        applyCovers(row);
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideStatus(statusEl);

        const memberName = memberSelect.value;
        const rankings = selects.map(s => s.value).filter(v => v);

        if (!memberName) {
            showStatus(statusEl, 'Veldu nafnið þitt.', true);
            return;
        }
        if (rankings.length === 0) {
            showStatus(statusEl, 'Veldu að minnsta kosti eina bók.', true);
            return;
        }

        submitButton.disabled = true;
        try {
            const data = await postJson('/vote', { memberName: memberName, rankings: rankings });
            showStatus(statusEl, data.message || 'Atkvæði vistað.', false);
        } catch (error) {
            showStatus(statusEl, error.message, true);
        } finally {
            submitButton.disabled = false;
        }
    });
});