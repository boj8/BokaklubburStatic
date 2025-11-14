// JavaScript source code
// Books data - matches the data from BookService.cs
const booksData = [
    {
        order: 1,
        title: "A Confederacy of Dunces",
        author: "John Kennedy Toole",
        coverPath: "images/books/book1.jpg",
        description: "Meistaraverk í gamanleik sem fylgir ævintýrum Ignatius J. Reilly, sérvitra mannsins sem býr hjá móður sinni í New Orleans."
    },
    {
        order: 2,
        title: "Sinuhe egyptiläinen",
        author: "Mika Waltari",
        coverPath: "images/books/book2.jpg",
        description: "Söguleg skáldsaga sem gerist í Fornegyptalandi og fylgir lífi læknisins Sinuhe á valdatíma faraósins Akhenaten."
    },
    {
        order: 3,
        title: "Die Verwandlung",
        author: "Franz Kafka",
        coverPath: "images/books/book3.jpg",
        description: "Smásaga um Gregor Samsa, sem vaknar einn morgun og uppgötvar að hann hefur breyst í risavaxið skordýr, og þarf að takast á við undarlegar afleiðingar þess."
    },
    {
        order: 4,
        title: "Der Prozess",
        author: "Franz Kafka",
        coverPath: "images/books/book4.jpg",
        description: "Skáldsaga sem fylgir Josef K., sem er handtekinn og saksóttur af fjarlægu yfirvaldi án þess að komast nokkurn tíma að því fyrir hvaða glæp."
    },
    {
        order: 5,
        title: "The Man in the High Castle",
        author: "Philip K. Dick",
        coverPath: "images/books/book5.jpg",
        description: "Skáldsaga um aðra tímalínu þar sem Öxulveldin unnu seinni heimsstyrjöldina og skiptu Bandaríkjunum á milli sín."
    },
    {
        order: 6,
        title: "Sextíu kíló af sólskini",
        author: "Hallgrímur Helgason",
        coverPath: "images/books/book6.jpg",
        description: "Íslensk skáldsaga sem gerist á Segulfirði og kannar menningararf þjóðarinnar í gegnum sögu margra kynslóða."
    },
    {
        order: 7,
        title: "Fátækt fólk",
        author: "Tryggvi Emilsson",
        coverPath: "images/books/book7.jpg",
        description: "Áhrifamikil æviminning um baráttu og von í fátæku íslensku sveitasamfélagi fyrri alda."
    }
];

function getMostRecentBook() {
    return booksData.reduce((max, book) => book.order > max.order ? book : max, booksData[0]);
}

function getPreviousBooks() {
    const mostRecent = getMostRecentBook();
    return booksData.filter(book => book.order !== mostRecent.order).sort((a, b) => b.order - a.order);
}
