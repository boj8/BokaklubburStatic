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
    },
    {
        order: 8,
        title: "Project Hail Mary",
        author: "Andy Weir",
        coverPath: "images/books/book8.jpg",
        description: "Vísindaskáldsaga um minnisislausan kennara sem vaknar einn á geimskipi milljarða kílómetra frá heimili sínu og þarf að bjarga mannkyninu frá útrýmingu."
    },
    {
        order: 9,
        title: "Lawrence in Arabia: War, Deceit, Imperial Folly and the Making of the Modern Middle East",
        author: "Scott Anderson",
        coverPath: "images/books/book9.jpg",
        description: "Söguleg frásögn af T.E. Lawrence og hlutverki hans í fyrri heimsstyrjöldinni í Miðausturlöndum og hvernig átök stórvelda mótuðu nútíma Miðausturlönd."
    },
    {
        order: 10,
        title: "Wiseguy",
        author: "Nicholas Pileggi",
        coverPath: "images/books/book10.jpg",
        description: "Rannsóknarbók/sjálfsævisaga um Henry Hill og innsýn í bandarísku undirheimana og daglegt líf glæpahópa."
    },
    {
        order: 11,
        title: "Mr. Nice",
        author: "Howard Marks",
        coverPath: "images/books/book11.jpg",
        description: "Sjálfsævisaga Howard Marks sem lýsir ævintýrum hans í heimi fíkniefna, viðskipta og alþjóðlegra tengsla."
    },
    {
        order: 12,
        title: "God Bless You, Mr. Rosewater",
        author: "Kurt Vonnegut",
        coverPath: "images/books/book12.jpg",
        description: "Satírísk skáldsaga um auðkýfing sem reynir að dreifa auði sínum meðal fátækra, og kannar hugmyndir um mannkosti og samfélag."
    },
    {
        order: 13,
        title: "Мастер и Маргарита",
        author: "Mikhail Bulgakov",
        coverPath: "images/books/book13.jpg",
        description: "Satírísk og fantasísk skáldsaga sem fléttast saman við rannsóknir á trú, völdum og ást, ein af þekktustu bókum rússneskrar bókmenntasögu."
    }
];

function getMostRecentBook() {
    return booksData.reduce((max, book) => book.order > max.order ? book : max, booksData[0]);
}

function getPreviousBooks() {
    const mostRecent = getMostRecentBook();
    return booksData.filter(book => book.order !== mostRecent.order).sort((a, b) => b.order - a.order);
}
