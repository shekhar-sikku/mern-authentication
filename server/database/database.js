import mongoose from 'mongoose';

const connect = async () => {
    try {
        const instance = await mongoose.connect('mongodb://0.0.0.0:27017/authentication');
        console.log(`\nConnected to database successfully! Host : ${instance.connection.host}`);
    } catch (error) {
        console.error('\nDatabase connection failed! :', error.message, '\n');
    }
};

export default connect;