document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('resultsContainer');

    try {
        const data = await votingRequest('/results');
        const totalVoters = (data && data.totalVoters) || 0;
        const requiredVoters = VOTING_MEMBERS.length;

        // Results are shown only when every member has voted
        if (totalVoters < requiredVoters) {
            container.innerHTML = `
                <div class="apply-validation-summary">
                    Niðurstöður birtast þegar allir meðlimir hafa kosið.
                    ${totalVoters} af ${requiredVoters} hafa kosið.
                </div>
            `;
            return;
        }

        const results = data.results || [];

        if (results.length === 0) {
            container.innerHTML = '<p class="vote-hint">Engin atkvæði hafa verið greidd enn.</p>';
            return;
        }

        container.innerHTML = `
            <p class="apply-description">Fjöldi kjósenda: <strong>${totalVoters}</strong></p>
            <ol class="results-list">
                ${results.map((r, index) => `
                    <li class="${index === 0 ? 'results-winner' : ''}">
                        <img class="result-cover" data-cover-for="${escapeHtml(r.book)}" alt="${escapeHtml(r.book)}" hidden />
                        <div class="result-text">
                            <span class="results-book">${escapeHtml(r.book)}</span>
                            <span class="results-meta">
                                meðaltal: ${r.averageRank.toFixed(2).replace('.', ',')} · atkvæði: ${r.voteCount}
                            </span>
                        </div>
                    </li>
                `).join('')}
            </ol>
            <p class="vote-hint">Lægra meðaltal er betra. Bókin efst er sigurvegarinn.</p>
        `;

        applyCovers(container);
    } catch (error) {
        container.innerHTML = `<div class="apply-validation-summary">${escapeHtml(error.message)}</div>`;
    }
});