const notificationSeed = [
    {_id: 10000, userFrom: 10000, userTo: 10001, new: true, type: "review"},
    {_id: 10001, userFrom: 10000, userTo: 10001, new: false, type: "review"},
    {_id: 10002, userFrom: 10000, userTo: 10001, new: false, type: "review"},
    {_id: 10003, userFrom: 10001, userTo: 10000, new: true, type: "review"}
];

module.exports = { notificationSeed };