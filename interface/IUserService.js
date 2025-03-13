class ITopicService {
    async getUser() { throw new Error("Not implemented"); }
    async getUserByName(username) { throw new Error("Not implemented"); }
    async createUser(user) { throw new Error("Not implemented"); }
    async updateUser(username, user) { throw new Error("Not implemented"); }
    async deleteUser(username) { throw new Error("Not implemented"); }
}

module.exports = ITopicService;
