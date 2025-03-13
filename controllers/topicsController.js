const topicService = require('../Services/TopicService.js');

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await topicService.getAllTopics();
        res.json(topics);
    } catch (err) {
        res.status(500).send(`Lỗi: ${err.message}`);
    }
};

exports.addTopic = async (req, res) => {
    try {
        const { TopicID, Name } = req.body;
        const message = await topicService.addTopic({ TopicID, Name });
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const { topicID } = req.params;
        const { Name } = req.body;
        console.log("Dữ liệu nhận được:", { topicID, Name });
        const message = await topicService.updateTopic(topicID, { Name });
        res.status(200).send(message);
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const { topicID } = req.params;
        const message = await topicService.deleteTopic(topicID);
        res.status(200).send(message);
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
};
