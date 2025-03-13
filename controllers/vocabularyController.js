const vocabularyService = require("../services/VocabularyService.js");

exports.getAllVocabulary = async (req, res) => {
    try {
        const vocabularies = await vocabularyService.getAllVocabulary();
        res.json(vocabularies);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getWordById = async (req, res) => {
    try {     
        const word = await vocabularyService.getWordById(req.params.id);
        if (!word) {
            return res.status(404).send("Không tìm thấy từ.");
        }
        res.json(word);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getVocabularyByTopic = async (req, res) => {
    try {
        const words = await vocabularyService.getVocabularyByTopic(req.params.topicId);
        res.json(words);
        console.log("du lieu:" ,req.params.topicId);
    } catch (err) {
        
        res.status(500).send(err.message);
    }
};

exports.createWord = async (req, res) => {
    try {
        const message = await vocabularyService.createWord(req.body);
        res.status(201).send(message);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateWord = async (req, res) => {
    try {
        const message = await vocabularyService.updateWord(req.params.id, req.body);
        res.send(message);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteWord = async (req, res) => {
    try {
        const message = await vocabularyService.deleteWord(req.params.id);
        res.send(message);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
