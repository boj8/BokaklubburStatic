const VOTING_MEMBERS = ['Bjartur', 'Kristbjörg', 'Egill', 'Ásgeir', 'Emil', 'Pétur', 'Þorbjörn'];
const VOTING_MAX_RANKS = 5;

function getVoteId() {
    const param = new URLSearchParams(window.location.search).get('vote');
    if (param) {
        return param;
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function votingUrl(path) {
    return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.vote}/${encodeURIComponent(getVoteId())}${path}`;
}

async function votingRequest(path, options) {
    const response = await fetch(votingUrl(path), options);
    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        // Response had no JSON body
    }
    if (!response.ok) {
        throw new Error((data && data.message) || 'Villa kom upp. Vinsamlegast reyndu aftur.');
    }
    return data;
}

function postJson(path, body) {
    return votingRequest(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function populateMemberSelect(select) {
    select.innerHTML = '<option value="">— Veldu nafn —</option>' +
        VOTING_MEMBERS.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
}

function showStatus(element, message, isError) {
    element.textContent = message;
    element.className = isError ? 'apply-validation-summary' : 'apply-success';
    element.style.display = 'block';
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideStatus(element) {
    element.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const label = document.getElementById('voteIdLabel');
    if (label) {
        label.textContent = getVoteId();
    }
});

const COVER_CACHE_KEY = 'bookCoverCache';

function readCoverCache() {
    try {
        return JSON.parse(localStorage.getItem(COVER_CACHE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function writeCoverCache(cache) {
    try {
        localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        // Storage unavailable or full; covers just won't be cached
    }
}

// Accepts "Title – Author" (as saved by the nominate page) or a plain typed title.
async function getBookCover(book) {
    const key = book.trim().toLowerCase();
    const cache = readCoverCache();
    if (key in cache) {
        return cache[key];
    }

    const parts = book.split(' – ');
    const title = parts[0].trim();
    const author = parts.length > 1 ? parts.slice(1).join(' – ').trim() : '';

    try {
        let url = 'https://openlibrary.org/search.json?limit=1&fields=cover_i' +
            `&title=${encodeURIComponent(title)}`;
        if (author) {
            url += `&author=${encodeURIComponent(author)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            return null; // Don't cache failures
        }
        const data = await response.json();
        const doc = data.docs && data.docs[0];
        const coverUrl = doc && doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : null;

        const latest = readCoverCache();
        latest[key] = coverUrl;
        writeCoverCache(latest);
        return coverUrl;
    } catch (e) {
        return null;
    }
}

// Fills every <img data-cover-for="Book"> inside the container and unhides it when a cover is found.
async function applyCovers(container) {
    const images = Array.from(container.querySelectorAll('img[data-cover-for]'));
    await Promise.all(images.map(async img => {
        const book = img.dataset.coverFor;
        const coverUrl = await getBookCover(book);
        if (coverUrl && img.dataset.coverFor === book) { // Skip if the selection changed meanwhile
            img.src = coverUrl;
            img.hidden = false;
        }
    }));
}