db.createUser ({
    user : `${process.env.MONGODB_USER}`,
    pwd : `${process.env.MONGODB_USER}`,
    roles : [{
        role : "readWrite", db : `${process.env.MONGODB_DATABASE}`
    }]
});

db.auth(`${process.env.MONGODB_USER}`, `${process.env.MONGODB_PASSWORD}`);
