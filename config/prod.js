export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://toy-yiftach:airdnd@cluster0.zsnubhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  dbName : process.env.DB_NAME || 'CodeSync'
}
