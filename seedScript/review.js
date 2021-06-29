const reviewSeed = [
    {_id: 10000, userFrom: 10000, userTo: 10001, ratings: 1, feedBack: ["Not Polite"], comment: "worst" },
    {_id: 10001, userFrom: 10000, userTo: 10002, ratings: 2, feedBack: ["Not Polite"], comment: "bad" },
    {_id: 10002, userFrom: 10000, userTo: 10001, ratings: 3, feedBack: ["Polite"], comment: "fair" },
    {_id: 10003, userFrom: 10001, userTo: 10002, ratings: 4, feedBack: ["Polite"], comment: "good" },
    {_id: 10004, userFrom: 10002, userTo: 10001, ratings: 5, feedBack: ["Polite"], comment: "very good" },
    {_id: 10005, userFrom: 10001, userTo: 10000, ratings: 4, feedBack: ["Polite"], comment: "good" },
    {_id: 10006, userFrom: 10002, userTo: 10000, ratings: 2, feedBack: ["Not Polite"], comment: "bad" },
];

module.exports = { reviewSeed };