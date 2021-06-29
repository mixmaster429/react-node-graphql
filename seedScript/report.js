const reportSeed = [
    {_id: 1, language:[{langCode: "en", name: "Offensive behaviour", description: "Offensive"},{langCode: "fr", name: "Comportement offensant", description: "Offensif"},{langCode: "ar", name: "سلوك هجومي", description: "هجومي"}],image: "offense.png"},
    {_id: 2, language:[{langCode: "en", name: "Scammer", description: "Scammer"},{langCode: "fr", name: "Escroc", description: "Escroc"},{langCode: "ar", name: "المخادع", description: "المخادع"}], image: "scam.png"},
    // {_id: 3,language:[{langCode: "en", name: "MIA at meetups", description: "MIA"},{langCode: "fr", name: "MIA at meetups", description: "MIA"},{langCode: "ar", name: "MIA at meetups", description: "MIA"}], image: "mia.png"},
    {_id: 4, language:[{langCode: "en", name:"Suspicious behavior", description: "Suspicious"},{langCode: "fr", name:"Comportement suspect", description: "Méfiant"},{langCode: "ar", name:"سلوك مشبوه", description: "مشبوه"}], image: "suspicious.png"},
    {_id: 5, language:[{langCode: "en", name: "Inactive", description:"Inactive"},{langCode: "fr", name: "Inactif", description:"Inactif"},{langCode: "ar", name: "غير نشط", description:"غير نشط"}], image: "inactive.png"},
    {_id: 6, language:[{langCode: "en", name: "Selling prohibited items", description: "prohibited"},{langCode: "fr", name: "Vendre des articles interdits", description: "interdit"},{langCode: "ar", name: "بيع المواد المحظورة", description: "المحظورة"}], image: "prohibited.png"},
    {_id: 7, language:[{langCode: "en", name: "Spammer", description: "Spam"},{langCode: "fr", name: "Spammeur", description: "Spam"},{langCode: "ar", name: "مرسلي البريد المزعج", description: "بريد مؤذي"}], image: "spam.png"},
    {_id: 8, language:[{langCode: "en", name: "Counterfiet items", description: "Counterfiet"},{langCode: "fr", name: "Articles de contrefaçon", description: "Contrefaire"},{langCode: "ar", name: "البنود مكافحة", description: "تزوير"}], image: "counterfeit.png"},
    {_id: 9, language:[{langCode: "en", name: "Other",description: "other"},{langCode: "fr", name: "Autre",description: "autre"},{langCode: "ar", name: "آخر",description: "آخر"}], image: "other.png"}
];

module.exports = { reportSeed };